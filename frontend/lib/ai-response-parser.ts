export function extractJsonFromAiResponse(rawText: string): { success: boolean; data: any; error?: string } {
  if (!rawText || rawText.trim().length === 0) {
    return { success: false, data: null, error: "Empty response" };
  }

  const trimmed = rawText.trim();

  // If it's already a plain JSON object (starts with { or [)
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      return { success: true, data: parsed };
    } catch {
      // Not valid JSON despite starting with brace — fall through
    }
  }

  // Strip markdown code blocks: ```json ... ``` or ``` ... ```
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (codeBlockMatch) {
    const jsonStr = codeBlockMatch[1].trim();
    try {
      const parsed = JSON.parse(jsonStr);
      return { success: true, data: parsed };
    } catch {
      // Code block content not valid JSON — fall through
    }
  }

  // Try to find a JSON object anywhere in the text: { ... }
  const jsonObjectMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonObjectMatch) {
    try {
      const parsed = JSON.parse(jsonObjectMatch[0]);
      return { success: true, data: parsed };
    } catch {
      // Found braces but not valid JSON
    }
  }

  // Try to find a JSON array: [ ... ]
  const jsonArrayMatch = trimmed.match(/\[[\s\S]*\]/);
  if (jsonArrayMatch) {
    try {
      const parsed = JSON.parse(jsonArrayMatch[0]);
      return { success: true, data: parsed };
    } catch {
      // Found brackets but not valid JSON
    }
  }

  // Try heuristic: remove trailing commas, unclosed brackets
  try {
    let repaired = trimmed
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const braceBalance = (repaired.match(/{/g) || []).length - (repaired.match(/}/g) || []).length;
    const bracketBalance = (repaired.match(/\[/g) || []).length - (repaired.match(/\]/g) || []).length;
    if (braceBalance > 0) repaired += "}".repeat(braceBalance);
    if (bracketBalance > 0) repaired += "]".repeat(bracketBalance);
    repaired = repaired.replace(/,(\s*[}\]])/g, "$1");
    if (repaired.startsWith("{") || repaired.startsWith("[")) {
      const parsed = JSON.parse(repaired);
      return { success: true, data: parsed };
    }
  } catch {
    // Repair failed
  }

  return { success: false, data: null, error: "No valid JSON found in AI response" };
}
