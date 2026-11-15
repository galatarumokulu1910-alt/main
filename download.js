const https = require('https');
const fs = require('fs');

const url = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzcyN2E1OGU1Y2M0OTRmY2I5ZWFjYTZhZWE3OThlMGJiEgsSBxDI5-Py1AYYAZIBIwoKcHJvamVjdF9pZBIVQhM3NzE3OTk1MzQ2OTQyMTM0MDc0&filename=&opi=89354086';

https.get(url, (res) => {
    const file = fs.createWriteStream('stitch-screens/06-past-events.html');
    res.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log('Download complete');
    });
}).on('error', (err) => {
    console.error('Error:', err);
});
