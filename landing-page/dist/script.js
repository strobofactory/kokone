'use strict';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const narrow = window.matchMedia('(max-width: 760px)');
const items = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window && !reduced.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-revealed');
    observer.unobserve(entry.target);
  }), {threshold: .01, rootMargin:'0px 0px -6% 0px'});
  document.documentElement.classList.add('motion-ready');
  requestAnimationFrame(() => requestAnimationFrame(() => items.forEach(el => observer.observe(el))));
}
const hero = document.querySelector('.hero');
let frame = 0;
function updateHero() {
  frame = 0;
  if (reduced.matches || narrow.matches) {
    hero.removeAttribute('style');
    return;
  }
  const progress = Math.max(0,Math.min(1,-hero.getBoundingClientRect().top / hero.offsetHeight));
  hero.style.setProperty('--hero-bg-y', `${progress * 75}px`);
  hero.style.setProperty('--hero-bg-scale', `${1 + progress * .04}`);
  hero.style.setProperty('--hero-copy-y', `${progress * 50}px`);
  hero.style.setProperty('--hero-copy-opacity', `${Math.max(.25,1-progress*.8)}`);
  hero.style.setProperty('--hero-visual-y', `${progress * 95}px`);
  hero.style.setProperty('--hero-visual-scale', `${1-progress*.035}`);
}
function requestHero(){if(!frame) frame = requestAnimationFrame(updateHero)}
window.addEventListener('scroll',requestHero,{passive:true});
window.addEventListener('resize',requestHero);
reduced.addEventListener('change', () => {items.forEach(el=>el.classList.add('is-revealed'));requestHero()});
requestHero();
const carousel = document.querySelector('.carousel');
const cards = [...carousel.children];
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
let index = 0;
function syncCarousel(){
 const left = carousel.getBoundingClientRect().left + parseFloat(getComputedStyle(carousel).paddingLeft);
 index = cards.reduce((best,card,i)=>Math.abs(card.getBoundingClientRect().left-left)<Math.abs(cards[best].getBoundingClientRect().left-left)?i:best,0);
 const atEnd=carousel.scrollLeft >= carousel.scrollWidth-carousel.clientWidth-3;
 prev.disabled=carousel.scrollLeft<3; next.disabled=atEnd;
 document.querySelector('#carousel-count').textContent=`${String(atEnd?cards.length:index+1).padStart(2,'0')} / 06`;
}
function move(direction){const target=Math.max(0,Math.min(cards.length-1,index+direction));carousel.scrollTo({left:cards[target].offsetLeft-cards[0].offsetLeft,behavior:reduced.matches?'instant':'smooth'})}
prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
carousel.addEventListener('scroll',syncCarousel,{passive:true});
carousel.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}});
window.addEventListener('resize',syncCarousel);syncCarousel();
const steps=[...document.querySelectorAll('.story-step')];
const images=[...document.querySelectorAll('.story-image')];
const labels=JSON.parse(document.body.dataset.storyLabels).map((label,i)=>`${String(i+1).padStart(2,'0')} — ${label}`);
function setStep(index){steps.forEach((el,i)=>el.classList.toggle('is-active',i===index));images.forEach((el,i)=>{el.classList.toggle('active',i===index);el.setAttribute('aria-hidden',i===index?'false':'true')});document.querySelector('#story-status').textContent=labels[index]}
setStep(0);
if ('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)setStep(Number(entry.target.dataset.storyStep))})},{rootMargin:'-35% 0px -40% 0px',threshold:0});steps.forEach(el=>observer.observe(el))}
else steps.forEach(el=>el.classList.add('is-active'));
const questions=[...document.querySelectorAll('.faq-list details')];
questions.forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)questions.forEach(other=>{if(other!==detail)other.open=false})}));
const dialog=document.querySelector('#screen-dialog');let opener;
document.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>{opener=button;document.querySelector('#zoom-image').src=button.dataset.zoom;dialog.showModal()}));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
dialog.addEventListener('close',()=>opener?.focus());
