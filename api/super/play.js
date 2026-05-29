const API_URL = "https://brown-antelope-528999.hostingersite.com/ostora/channels.php";

export default async function handler(req, res) {

const { id, cat } = req.query;

if (!id || !cat) {
return res.status(400).send("Missing Parameters");
}

try {

const r = await fetch(`${API_URL}?cat=${cat}`);
const data = await r.json();

const channel = (data.items || []).find(x => String(x.id) === String(id));

if (!channel) {
return res.status(404).send("Channel Not Found");
}

return res.redirect(channel.stream_url);

} catch (e) {
return res.status(500).send(e.message);
}

}
