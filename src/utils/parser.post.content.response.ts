export const parsePostContentResponse = (rawString:string) => {
    let jsonString = rawString.replace(/```json\n|```/g, '')
    const step1 = jsonString.toString().split(`\"content\":`)[1]
    const step2 = step1.split(`\"keywords\"`)[0]
    jsonString = jsonString.replace(step2, '"",')
    jsonString = jsonString.replace(',\n}', "\n}")
    jsonString = jsonString.replace(',}', "}")
    const json = JSON.parse(jsonString);
    json.content = step2.trim()
        .replace('"', '')
        .split('').reverse().join('')
        .replace('"', '')
        .replace(',', '')
        .split('').reverse().join('')
        .replaceAll(/\\n/g, '\n')
        .replaceAll(/\\"/g, '\"')
    return json
}