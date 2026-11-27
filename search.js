/* Search: normalize queries and indexed text for matching only; preserve original Hebrew for display. */
(function(){
  'use strict';

  var data=window.__LILMOD_DATA;
  if(!data || !Array.isArray(data.lessons)) return;

  var input=document.getElementById('search');
  var resultsBox=document.getElementById('searchResults');
  var list=document.getElementById('lessonList');
  if(!input || !resultsBox || !list) return;

  function normalize(value){
    var text=String(value==null?'':value).toLowerCase();
    if(typeof text.normalize==='function') text=text.normalize('NFD');
    // Strip Hebrew niqqud/cantillation as well as Latin combining marks.
    return text.replace(/[\u0300-\u036f]/g,'').replace(/[\u0591-\u05C7]/g,'').trim();
  }
  function escapeHTML(value){
    return String(value==null?'':value).replace(/[&<>"']/g,function(character){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character];
    });
  }
  function fieldsMatch(fields,query){
    return normalize(fields.join(' ')).indexOf(query)!==-1;
  }
  function lessonMatches(lesson,query){
    if(fieldsMatch([lesson.numero,lesson.page,lesson.titre_mg,lesson.titre_fr,lesson.titre_trans,lesson.titre_he],query)) return true;
    return ['phrases','vocab'].some(function(type){
      return (lesson[type]||[]).some(function(row){ return fieldsMatch([row.pron,row.he,row.fr,row.mg],query); });
    });
  }
  function renderList(rawQuery){
    var query=normalize(rawQuery);
    var activeButton=list.querySelector('.lesson-item.active');
    var activeNumber=activeButton?Number(activeButton.getAttribute('data-search-lesson')):null;
    var completed=[];
    try{ completed=JSON.parse(localStorage.getItem('lilmod_done')||'[]'); }catch(error){}
    var matches=data.lessons.filter(function(lesson){ return !query || lessonMatches(lesson,query); });
    list.innerHTML=matches.map(function(lesson){
      var number=Number(lesson.numero)||0;
      return '<button type="button" class="lesson-item'+(number===activeNumber?' active':'')+'" data-search-lesson="'+number+'">'+
        '<span class="num">'+String(number).padStart(3,'0')+'</span><span>'+escapeHTML(lesson.titre_mg||lesson.titre_fr||'')+'</span>'+
        (completed.indexOf(number)!==-1?'<span aria-label="Lesona vita">✓</span>':'')+'</button>';
    }).join('');
  }
  function makeCard(lesson,tab,row){
    return '<button type="button" class="result-card" data-search-lesson="'+Number(lesson.numero)+'" data-search-tab="'+tab+'">'+
      '<div class="rc-pron">'+escapeHTML(row.pron||'')+'</div>'+
      '<div class="rc-he" lang="he" dir="rtl">'+escapeHTML(row.he||'')+'</div>'+
      '<div class="rc-fr">'+escapeHTML(row.fr||'')+'</div>'+
      '<div class="rc-mg">'+escapeHTML(row.mg||'')+'</div>'+
      '<div class="rc-meta">Lesona '+Number(lesson.numero)+' · '+(tab==='phrases'?'Fehezanteny':'Rakiteny')+' · Pejy '+escapeHTML(lesson.page||'')+'</div></button>';
  }
  function makeLessonTitleCard(lesson){
    return '<button type="button" class="result-card" data-search-lesson="'+Number(lesson.numero)+'" data-search-tab="phrases">'+
      '<div class="rc-pron">'+escapeHTML(lesson.titre_trans||'')+'</div>'+
      '<div class="rc-he" lang="he" dir="rtl">'+escapeHTML(lesson.titre_he||'')+'</div>'+
      '<div class="rc-fr">'+escapeHTML(lesson.titre_fr||'')+'</div>'+
      '<div class="rc-mg">'+escapeHTML(lesson.titre_mg||'')+'</div>'+
      '<div class="rc-meta">Lohatenin’ny lesona '+Number(lesson.numero)+' · Pejy '+escapeHTML(lesson.page||'')+'</div></button>';
  }
  function renderResults(rawQuery){
    var query=normalize(rawQuery);
    if(query.length<2){
      resultsBox.innerHTML='';
      resultsBox.hidden=true;
      var lessonView=document.getElementById('lessonView');
      var welcome=document.getElementById('welcome');
      if(lessonView) lessonView.hidden=false;
      if(welcome) welcome.style.display='';
      return;
    }

    var cards=[];
    data.lessons.forEach(function(lesson){
      var titleFields=[lesson.titre_mg,lesson.titre_fr,lesson.titre_trans,lesson.titre_he];
      var titleMatched=fieldsMatch(titleFields,query);
      var rowMatched=false;
      ['phrases','vocab'].forEach(function(tab){
        (lesson[tab]||[]).forEach(function(row){
          if(fieldsMatch([row.pron,row.he,row.fr,row.mg],query)){
            cards.push(makeCard(lesson,tab,row));
            rowMatched=true;
          }
        });
      });
      if(titleMatched && !rowMatched) cards.push(makeLessonTitleCard(lesson));
    });

    var hint=cards.length?'<p class="search-results-hint">Tsindrio ny karatra raha hijery ny lesona manontolo nahitana ilay teny.</p>':'';
    var heading='<div class="search-results-head"><h2>Valin’ny fikarohana: '+cards.length+'</h2>'+hint+'<p>“'+escapeHTML(rawQuery)+'”</p></div>';
    resultsBox.innerHTML=heading+(cards.length?cards.join(''):'<p class="muted">Tsy nahitana valiny.</p>');
    resultsBox.hidden=false;
    var lessonView=document.getElementById('lessonView');
    var welcome=document.getElementById('welcome');
    if(lessonView) lessonView.hidden=true;
    if(welcome) welcome.style.display='none';
  }

  // Replace the app's original renderers so the lesson list and result cards share
  // the same accent-insensitive matching, while display always uses original data.
  window.renderList=renderList;
  window.renderSearchResults=renderResults;
  input.addEventListener('input',function(){
    renderList(input.value);
    renderResults(input.value);
  });
  document.addEventListener('click',function(event){
    var card=event.target.closest('.result-card[data-search-lesson]');
    if(card){
      var lessonNumber=Number(card.getAttribute('data-search-lesson'));
      var tab=card.getAttribute('data-search-tab');
      if(tab && typeof window.setTab==='function') window.setTab(tab);
      if(typeof window.openLesson==='function') window.openLesson(lessonNumber);
      return;
    }
    var lessonButton=event.target.closest('.lesson-item[data-search-lesson]');
    if(lessonButton && typeof window.openLesson==='function') window.openLesson(Number(lessonButton.getAttribute('data-search-lesson')));
  });
})();
