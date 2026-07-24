const https = require('https');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const data = req.body;
    const WEBHOOK = process.env.SHEETS_WEBHOOK_URL || '';
    if (WEBHOOK) {
      const payload = JSON.stringify({values:[[new Date().toISOString(), data.name||'', data.phone||'', data.email||'', data.experience||'', data.program||'', data.message||'', data.source||'', data.page||'']]});
      const url = new URL(WEBHOOK);
      await new Promise((res,rej) => {
        const r = https.request({hostname:url.hostname,path:url.pathname+url.search,method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(payload)}},(resp)=>{resp.on('data',()=>{});resp.on('end',res);});
        r.on('error',rej);r.write(payload);r.end();
      });
    }
    return res.status(200).json({success:true});
  } catch(err) { return res.status(200).json({success:true}); }
};