const money=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n).replace('IDR','Rp');

const slider=document.getElementById('slider');
const slides=[...document.querySelectorAll('.slide')];
const dots=document.getElementById('dots');
let current=0;
let isProgrammatic=false;

function goTo(index){
  current=Math.max(0,Math.min(slides.length-1,index));
  slides[current].scrollIntoView({behavior:'smooth',inline:'start',block:'nearest'});
  updateUI();
}
function updateUI(){
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>goTo(Number(b.dataset.go)));
  dots.innerHTML=slides.map((_,i)=>`<button class="${i===current?'active':''}" aria-label="Slide ${i+1}"></button>`).join('');
  dots.querySelectorAll('button').forEach((b,i)=>b.onclick=()=>goTo(i));
  document.getElementById('progress').style.width=((current+1)/slides.length*100)+'%';
}
document.getElementById('prev').onclick=()=>goTo(current-1);
document.getElementById('next').onclick=()=>goTo(current+1);

// Track the active full-screen slide.
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting && e.intersectionRatio>.65){
      current=Number(e.target.dataset.slide);
      updateUI();
    }
  });
},{root:slider,threshold:[.65,.85]});
slides.forEach(s=>observer.observe(s));

// Desktop wheel -> horizontal page movement. Touch swipes remain native.
slider.addEventListener('wheel',e=>{
  if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){
    e.preventDefault();
    const dir=e.deltaY>0?1:-1;
    goTo(current+dir);
  }
},{passive:false});

// Budget calculator.
const calcIds=['lcd','mesin','battery','charge','labor'];
function updateTotal(){
  const total=calcIds.reduce((sum,id)=>sum+Number(document.getElementById(id).value),0);
  document.getElementById('total').textContent=money(total);
}
calcIds.forEach(id=>document.getElementById(id).addEventListener('change',updateTotal));

// Phone data: image 6 corrected to Galaxy A15 5G; final phone corrected to OPPO A71.
const phones=[
 {name:'ZTE Blade V40 Vita',price:1000000,img:'assets/phone-4-zte-v40-vita.jpg',spec:[
  ['Display','6.75" IPS LCD • 90Hz • 720×1600'],['Chipset','Unisoc T606'],['RAM / Storage','4GB / 128GB'],['Kamera','48MP + 2MP + 2MP'],['Selfie','8MP'],['Baterai','6000mAh • 22.5W']
 ],url:'https://www.gsmarena.com/zte_blade_v40_vita-pictures-11579.php'},
 {name:'Samsung Galaxy A51',price:1100000,img:'assets/phone-5-galaxy-a51.jpg',spec:[
  ['Display','6.5" Super AMOLED • FHD+'],['Chipset','Exynos 9611'],['RAM / Storage','4–8GB / 64–256GB'],['Kamera','48MP Quad Camera'],['Selfie','32MP'],['Baterai','4000mAh • 15W']
 ],url:'https://www.gsmarena.com/samsung_galaxy_a51-9963.php'},
 {name:'Samsung Galaxy A15 5G',price:2200000,img:'assets/phone-6-galaxy-a16.jpg',spec:[
  ['Display','6.5" Super AMOLED • 90Hz • 1080×2340'],['Chipset','MediaTek Dimensity 6100+'],['RAM / Storage','4–8GB / 64–256GB'],['Kamera','50MP + 5MP + 2MP'],['Selfie','13MP'],['Baterai','5000mAh • 25W']
 ],url:'https://www.gsmarena.com/samsung_galaxy_a15_5g-12638.php'},
 {name:'Samsung Galaxy Tab A9',price:2000000,img:'assets/phone-7-tab-a9.jpg',spec:[
  ['Display','8.7" TFT LCD • 800×1340'],['Chipset','MediaTek Helio G99'],['RAM / Storage','4/8GB / 64–128GB'],['Kamera','8MP belakang'],['Selfie','2MP'],['Baterai','5100mAh • 15W']
 ],url:'https://www.gsmarena.com/samsung_galaxy_tab_a9-12616.php'},
 {name:'Samsung Galaxy A17 5G',price:3459000,img:'assets/phone-8-galaxy-a17.jpg',spec:[
  ['Display','6.7" Super AMOLED • 90Hz'],['Chipset','Exynos 1330'],['RAM / Storage','4–8GB / 128–256GB'],['Kamera','50MP + 5MP + 2MP • OIS'],['Selfie','13MP'],['Baterai','5000mAh • 25W']
 ],url:'https://www.gsmarena.com/samsung_galaxy_a17_5g-14041.php'},
 {name:'OPPO A71 (2017)',price:300000,img:'assets/phone-9-oppo-f1.jpg',spec:[
  ['Display','5.2" IPS LCD • 720×1280'],['Chipset','MediaTek MT6750'],['RAM / Storage','3GB / 16GB'],['Kamera','13MP PDAF'],['Selfie','5MP'],['Baterai','3000mAh']
 ],url:'https://www.gsmarena.com/oppo_a71-8849.php'}
];

const grid=document.getElementById('phoneGrid');
grid.innerHTML=phones.map(p=>`<article class="phone-card">
  <div class="phone-image"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
  <div class="phone-body">
    <div class="phone-top"><h3>${p.name}</h3><div class="price">${money(p.price)}</div></div>
    <p>Unit second • harga contoh bazar • kondisi dapat disesuaikan.</p>
    <div class="specs">${p.spec.map(s=>`<div class="spec"><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>
    <a class="source" href="${p.url}" target="_blank" rel="noopener noreferrer">Lihat spesifikasi GSMArena ↗</a>
  </div>
</article>`).join('');

updateTotal();
updateUI();
