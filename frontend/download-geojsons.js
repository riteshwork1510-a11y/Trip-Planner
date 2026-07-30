const fs = require('fs');
const https = require('https');
const path = require('path');

const files = {
  'india-states.geojson': 'https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States',
  'usa-states.geojson': 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json',
  'canada-provinces.geojson': 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/CAN.geo.json', // wait, this might be the whole country, let's find provinces
  'australia-states.geojson': 'https://raw.githubusercontent.com/rowanhogan/australian-states/master/states.geojson'
};

// Better Canada provinces url
files['canada-provinces.geojson'] = 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/canada.geojson';

function download(filename, url) {
  const dest = path.join(__dirname, 'public', 'geojson', filename);
  https.get(url, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      return download(filename, res.headers.location);
    }
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded ' + filename);
    });
  }).on('error', (err) => {
    console.error('Error downloading ' + filename, err);
  });
}

for (const [filename, url] of Object.entries(files)) {
  download(filename, url);
}
