const BACKEND='https://gtmguy.llmxray-ai.chatgpt.site';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed.'})}
 let origin;try{origin=new URL(req.headers.origin)}catch{return res.status(403).json({error:'Submit from this website.'})}
 if(origin.host!==req.headers.host||origin.protocol!=='https:')return res.status(403).json({error:'Submit from this website.'});
 if(!String(req.headers['content-type']||'').includes('application/json'))return res.status(415).json({error:'Unsupported request format.'});
 try{
  const body=typeof req.body==='string'?req.body:JSON.stringify(req.body);
  if(!body||Buffer.byteLength(body)>24000)return res.status(413).json({error:'Your message is too long.'});
  const response=await fetch(BACKEND+'/api/submissions',{method:'POST',headers:{'Content-Type':'application/json','Origin':BACKEND},body,signal:AbortSignal.timeout(15000),redirect:'error'});
  return res.status(response.status).json(await response.json());
 }catch{return res.status(503).json({error:'Unable to save your details. Please email srichardroshan@gmail.com.'})}
}
