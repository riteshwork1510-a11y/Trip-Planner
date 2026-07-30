import urllib.request
import json
import urllib.parse
query = '[out:json][timeout:25];(node["historic"](22.2,68.9,22.3,69.0););out body;'
url = 'https://overpass-api.de/api/interpreter?data=' + urllib.parse.quote(query)
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'TourPlanner/1.0'})
    response = urllib.request.urlopen(req)
    data = json.loads(response.read().decode('utf-8'))
    print(len(data['elements']))
except Exception as e:
    print('Error:', e)
