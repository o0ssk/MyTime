const https = require('https');
const fs = require('fs');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        fs.writeFileSync(dest, data);
        resolve();
      });
    }).on('error', err => reject(err));
  });
}

(async () => {
  await download("https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzU3Mjg0Yzk2YzdmOTQyNzRiOTU0MjBjNmVhMTU2MDhlEgsSBxD2ptiQqwIYAZIBIwoKcHJvamVjdF9pZBIVQhM4OTQ0NDM4MjQyODk2NzM4ODEy&filename=&opi=89354086", "c:/Users/wasee/Desktop/MyTime/dashboard.html");
  await download("https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzU2YzU3NjdiNzM0YzRkN2JiZDFhYzdmZjEyMjZlMzY2EgsSBxD2ptiQqwIYAZIBIwoKcHJvamVjdF9pZBIVQhM4OTQ0NDM4MjQyODk2NzM4ODEy&filename=&opi=89354086", "c:/Users/wasee/Desktop/MyTime/modal.html");
  console.log("Done");
})();
