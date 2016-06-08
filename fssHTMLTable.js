function fssHTMLTable(ATableHE, AMRP, APNAlignToRight)
{
  function Init()
  {
    var
      LInitValue = JSON.parse(localStorage[LLSIdent] || '{}'),
      LNF = window.Intl ? new Intl.NumberFormat('en-US') : null;
    LTRs  = Array.prototype.slice.call(ATableHE.getElementsByTagName('tr'), 0);
    LTRTH = LTRs.shift();
    LParentHE = LTRTH.parentNode;
    for(var i = 0, L = LTHs.length, LSortIndex = -1; i < L; i++)
    {
      LTHs[i].addEventListener('click', SortCol);
      LTHs[i].fssIndex = i;
      if(LTHs[i].textContent === LInitValue.ColName)
      {
        LTHs[i].fssDirection = LInitValue.Direction;
        LSortIndex = i;
      }
      else
        LTHs[i].fssDirection = 1;
      LTHs[i].style.cursor = 'pointer';
      LTHs[i].fssIsNumber = true;
      for(var j = 0, LValue; j < LTRs.length; j++)
        if(parseFloat(LTRs[j].children[i].textContent) != LTRs[j].children[i].textContent)
        {
          LTHs[i].fssIsNumber = false;
          break;
        }
      if(LTHs[i].fssIsNumber)
        for(var j = 0, LValue; j < LTRs.length; j++)
        {
          LTRs[j].children[i].style['text-align'] = 'right';
          if(LNF)
            LTRs[j].children[i].innerHTML = LNF.format(LTRs[j].children[i].innerHTML);
        }
   }
   if(LSortIndex !== -1)
     SortCol({target: LTHs[LSortIndex]});
  }

  function PageNavigatorBuild()
  {
    function HECreate(ACaption, APageNo)
    {
      var LHE = LPageNavigatorHE.appendChild(document.createElement('span'));
      LHE.innerHTML = ACaption;
      LHE.addEventListener('click', function(){ PageNoSet(APageNo); });
      LHE.style.cursor = 'pointer';
      LHE.style.padding = '.1em .4em';
      return LHE;
    }

    function HEsUpdate(APageNo)
    {
      LHEs[LPageNo - 1].style.color = '';
      LHEs[APageNo - 1].style.color = 'red';
      LPrevHE.style.color = APageNo === 1 ? 'grey' : '';
      LNextHE.style.color = APageNo === LCount ? 'grey' : '';
    }

    function PageNoSet(APageNo)
    {
      if(APageNo < 1)
        APageNo = LPageNo - 1;
      else
      if(APageNo > LCount)
        APageNo = LPageNo + 1;
      else
      if(!APageNo)
        APageNo = LPageNo;

      if((APageNo >= 1) && (APageNo <= LCount))
      {
        HEsUpdate(APageNo);
        LPageNo = APageNo;
        var LStartIndex = (APageNo - 1) * AMRP;
        for(var i = 0, L = LTRs.length; i < L; i++)
          LTRs[i].style.display = ((i >= LStartIndex) && (i < LStartIndex + AMRP) ? '' : 'none');
      }
    }

    if((typeof AMRP !== 'number') || (AMRP < 0))
      AMRP = 0;
    if((AMRP <= 0) || (LTRs.length <= AMRP))
      return;
    var
      LCount = Math.ceil(LTRs.length / AMRP),
      LHEs = [],
      LPageNo = 1,
      LPageNavigatorHE = ATableHE.parentNode.insertBefore(document.createElement('div'), ATableHE),
      LPrevHE = HECreate('<', 0);
    if(APNAlignToRight)
      LPageNavigatorHE.style.textAlign = 'right';
    if('ontouchstart' in window)
      LPageNavigatorHE.style.fontSize = '32px';
    for(var i = 1; i <= LCount; i++)
      LHEs.push(HECreate(i, i));
    var LNextHE = HECreate('>', LCount + 1);
    PageNoSet(1);
    return PageNoSet;
  }

  function SortCol(AEvent)
  {
    function Sort(ATR1, ATR2)
    {
      function LNum(AValue)
      {
        return +AValue.replace(/,/g, '');
      }
      var
        LValue1 = ATR1.children[AEvent.target.fssIndex].textContent,
        LValue2 = ATR2.children[AEvent.target.fssIndex].textContent;
      if(AEvent.target.fssIsNumber)
        return (LNum(LValue1) - LNum(LValue2)) * AEvent.target.fssDirection;
      else
        return LValue1.toLowerCase().localeCompare(LValue2.toLowerCase()) * AEvent.target.fssDirection;
    }

    LTRs.sort(Sort);
    for(var i = 0, L = LTRs.length, LHE = LTRTH, LTR; i < L; i++)
    {
      LTR = LTRs[i];
      LParentHE.insertBefore(LTR, LHE.nextSibling);
      LHE = LTR;
    }
    for(var i = 0, L = LTHs.length; i < L; i++)
      if(AEvent.target === LTHs[i])
        LTHs[i].className = (LTHs[i].fssDirection === -1 ? 'ascend' : 'descend');
      else
        LTHs[i].className = '';
     if(LLSIdent)
      localStorage[LLSIdent] = JSON.stringify({
        ColName: LTRTH.children[AEvent.target.fssIndex].textContent,
        Direction: AEvent.target.fssDirection
      });
    AEvent.target.fssDirection *= -1;
    LPageNoSet && LPageNoSet();
  }

  function TableHEInit()
  {
    if(ATableHE.constructor === String)
      ATableHE = document.getElementById(ATableHE);
    if(ATableHE.constructor !== HTMLTableElement)
      throw new Error('Not html table');
  }

  TableHEInit();
  if('ontouchstart' in window)
    ATableHE.style.fontSize = '20px';
  var LTHs = ATableHE.getElementsByTagName('th'), LTRs, LTRTH, LParentHE;
  if(!LTHs.length)
    return;
  var LLSIdent = ATableHE.id ? location.pathname + ATableHE.id : '';
  Init();
  var LPageNoSet = PageNavigatorBuild();
}

(function()
{
  function StyleAdd(AName, AStyles)
  {
    if(document.styleSheets[0].addRule)
      document.styleSheets[0].addRule(AName, AStyles);
    else
      document.styleSheets[0].insertRule(AName + '{' + AStyles  + '}', 0);
  }
  if(!document.styleSheets[0])
    document.head.appendChild(document.createElement('style'));
  StyleAdd('th.ascend:after',  'content: "\\2193";');
  StyleAdd('th.descend:after', 'content: "\\2191";');
  if('ontouchstart' in window)
    StyleAdd('th', 'font-size: 32px;');
})();