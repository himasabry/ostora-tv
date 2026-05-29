export default async function handler(req, res) {

const { url } = req.query;

if(!url){
return res.status(400).send("Missing URL");
}

try {

const response = await fetch(url, {
headers:{
"User-Agent":"Mozilla/5.0",
"Referer":url
}
});

const contentType = response.headers.get("content-type") || "";

// ======================
// M3U8 HANDLING
// ======================
if(contentType.includes("mpegurl") || url.includes(".m3u8")){

let body = await response.text();

const base = url.substring(0, url.lastIndexOf("/") + 1);

body = body.split("\n").map(line => {

line = line.trim();

if(!line || line.startsWith("#")) return line;

if(!line.startsWith("http")){
line = base + line;
}

return `/api/proxy?url=${encodeURIComponent(line)}`;

}).join("\n");

res.setHeader("Content-Type","application/vnd.apple.mpegurl");
return res.send(body);
}

// ======================
res.setHeader("Content-Type",contentType);
return response.body.pipe(res);

} catch (e) {
res.status(500).send("Proxy Error: " + e.message);
}

}
