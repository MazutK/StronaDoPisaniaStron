document.addEventListener('DOMContentLoaded', () => {
  const htmlCode = document.getElementById('html-code');
  const cssCode = document.getElementById('css-code');
  const outputFrame = document.getElementById('output');
  const feedback = document.getElementById('feedback');
  const nextLevelButton = document.getElementById('next-level');
  const instructions = document.getElementById('instructions');
  const reset = document.getElementById('reset');
  const expandButton = document.getElementById('fullscreenButton');
  const previewSection = document.getElementById('preview');
  const iframe = document.getElementById('output');

  let isFullScreen = false; //Wartość domyślna dla okna podglądowego
  //next-level
  nextLevelButton.addEventListener('click', goToNextLevel);
  //reset
  reset.addEventListener('click',resetGame);

  // Obsługuje kliknięcie przycisku
  expandButton.addEventListener('click', toggleFullScreen);

  let currentLevel = localStorage.getItem('currentLevel');
  currentLevel = currentLevel ? parseInt(currentLevel, 10) : 1;  // Jeśli brak, ustaw 1 jako domyślny poziom
  //Zapisywanie do localstorage
  function saveCurrentLevelToLocalStorage() {
    localStorage.setItem('currentLevel', currentLevel);
  }

  // Inicjalizacja CodeMirror dla HTML
  const htmlEditor = CodeMirror.fromTextArea(htmlCode, {
    mode: 'xml',
    theme: 'dracula',
    lineNumbers: true,
    tabSize: 2,
    value: `<!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>My Page</title>
                </head>
                <body>
                  <h1>Witaj na stronie!</h1>
                  <!-- Twoje zadanie -->
                </body>
              </html>`
  });

  // Inicjalizacja CodeMirror dla CSS
  const cssEditor = CodeMirror.fromTextArea(cssCode, {
    mode: 'css',
    theme: 'dracula',
    lineNumbers: true,
    tabSize: 2,
    value: ` `
  });

  // Funkcja aktualizująca podgląd
function updatePreview() {
    const html = htmlEditor.getValue();
    const css = `<style>${cssEditor.getValue()}</style>`;
    const output = `${css}${html}`;

    const iframeDoc = outputFrame.contentDocument || outputFrame.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(output);
    iframeDoc.close();
  }
  //Funkcja do czyszczenia kodu wpisanego przez użytkownika
function cleanCode(code) {
    return code
      .replace(/^\s+/gm, '') // Usuwa nadmiarowe spacje na początku linii
      .replace(/\s*{\s*/g, '{') // Usuwa spacje wokół `{`
      .replace(/\s*}\s*/g, '}') // Usuwa spacje wokół `}`
      .replace(/\s*:\s*/g, ':') // Usuwa spacje wokół `:`
      .replace(/\s*;\s*/g, ';') // Usuwa spacje wokół `;`
      .toLowerCase();           // Konwertuje na małe litery
  }
  
  //funkcja zapisująca LocalStorage
function saveToLocalStorage() {
    // Zapisz zawartość HTML, CSS i poziom
    localStorage.setItem('htmlCode', htmlEditor.getValue());
    localStorage.setItem('cssCode', cssEditor.getValue());
    localStorage.setItem('currentLevel', currentLevel);
  }
  //Funkcja ładująca localStorage
function loadFromLocalStorage() {
    const savedHtmlCode = localStorage.getItem('htmlCode');
    const savedCssCode = localStorage.getItem('cssCode');
  
    if (savedHtmlCode) {
      htmlEditor.setValue(savedHtmlCode);
    }
    if (savedCssCode) {
      cssEditor.setValue(savedCssCode);
    }
  }
  loadFromLocalStorage();



// Funkcja do ustawienia komunikatu o sukcesie
function setSuccessFeedback(message) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message; 
  feedback.classList.add("success"); 
  feedback.classList.remove("error"); 
}

// Funkcja do ustawienia komunikatu o błędzie
function setErrorFeedback(message) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message; 
  feedback.classList.add("error"); 
  feedback.classList.remove("success"); 
}

  //Funkcja resetująca poziomy połączona z implementacją animacji wyskakującego okna
function resetGame() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: true
    });
    swalWithBootstrapButtons.fire({
      title: "Czy jesteś pewien?",
      text: "Nie będziesz w stanie przywrócić twojej pracy!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Tak, chcę usunąć!",
      cancelButtonText: "Nie, cofnij!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: "Usuwanie zakończone!",
          text: "Zawartość została wyzerowana.",
          icon: "success"
        });
    localStorage.clear();

    currentLevel = 1;
    saveCurrentLevelToLocalStorage();

    htmlEditor.setValue(``);
    cssEditor.setValue(``);

    instructions.innerHTML = `
      <h2>Poziom 1: Utwórz nagłówek 1 stopnia</h2>
      <p>Twoje zadanie to utworzenie nagłówka 1 stopnia (<code>&lt;h1&gt;</code>) w sekcji <code>&lt;body&gt;</code>, pamiętaj o zamknięciu. Wprowadź odpowiedni kod HTML, aby zakończyć poziom.</p>`;

    nextLevelButton.style.display = "none";
    feedback.textContent = "";

    updatePreview();
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Anulowano usuwanie",
          text: "Twoja praca jest bezpieczna :)",
          icon: "error"
        });
      }
    });
    
  }

  //Funkcja do podglądu w pełnym ekranie
function toggleFullScreen() {
    const previewStyle = previewSection.style;


    isFullScreen = !isFullScreen;

    if (isFullScreen){
    previewStyle.position = '';
    previewStyle.top = '';
    previewStyle.left = '';
    previewStyle.width = '100%';
    previewStyle.height = '500px'; 
    previewStyle.margin = ''; 
    previewStyle.padding = ''; 
    expandButton.textContent = 'Pełny ekran'; 
  } else {
    previewStyle.position = 'fixed'; 
    previewStyle.top = '0';
    previewStyle.left = '0';
    previewStyle.width = '100vw'; 
    previewStyle.height = '100vh'; 
    previewStyle.margin = '0'; 
    previewStyle.padding = '0'; 
    previewStyle.zIndex = '9999'; 
    expandButton.textContent = 'Zamknij podgląd pełnego ekranu'; 
  
  }
  iframe.style.width = '100%';
  iframe.style.height = '100%';
}


//Funkcje sprawdzające poszczególne poziomy
function checkLevel1() {
  const html = htmlEditor.getValue();  
  if (html.includes('<h1>') && html.includes('</h1>')) {
    setSuccessFeedback("Gratulacje! Użyłeś nagłówka 1 stopnia.");
    nextLevelButton.style.display = "block";
  } else {
    setErrorFeedback("Utwórz nagłówek 1 stopnia (h1) w ciele dokumentu.");
    nextLevelButton.style.display = 'none'; 
  }
  }

function checkLevel2() {
    const css = cleanCode(cssEditor.getValue());
    if (css.includes('h1{text-align:center;}')) {
      setSuccessFeedback("Gratulacje! Wyśrodkowałeś tekst.");
      nextLevelButton.style.display = 'block'; 
    } else {
      setErrorFeedback("Wyśrodkuj tekst za pomocą CSS dodając odpowiedni znacznik.");
      nextLevelButton.style.display = 'none'; 
    }
  }

function checkLevel3() {
    const css = cleanCode(cssEditor.getValue());
    const backgroundColorPattern = /body\s*\{\s*background-color\s*:\s*([^;]+)\s*;\s*\}/;
    const match = css.match(backgroundColorPattern);
  
    if (match) {
      const color = match[1].trim().toLowerCase();
      if (
        color !== 'black' && 
        color !== '#000' &&  
        color !== 'rgb(0,0,0)' && 
        color !== '#000000'
      ) {
        setSuccessFeedback("Gratulacje! Ustawiłeś tło w poprawnym kolorze!");
        nextLevelButton.style.display = "block";
      } else {
        setErrorFeedback("Kolor czarny jest zabroniony. Wybierz inny kolor.");
        nextLevelButton.style.display = "none";
      }
    } else {
      setErrorFeedback("Ustaw poprawny kolor tła w CSS (np. background-color: #ff0000;).");
      nextLevelButton.style.display = "none"; 
    }
  }

function checkLevel4() {
    const html = cleanCode(htmlEditor.getValue());
    const imgPattern = /<img\s+src=["'][^"']*["'][^>]*>/;
    
    if (imgPattern.test(html)) {
      setSuccessFeedback("Gratulacje! Dodałeś obrazek do strony.");
      nextLevelButton.style.display = "block";
    } else {
      setErrorFeedback("Dodaj obrazek za pomocą znacznika <img src=\"\" /> w HTML. Upewnij się, że tag <img> ma prawidłowy atrybut src.");
      nextLevelButton.style.display = "none";
    }
  }

function checkLevel5() {
    const html = cleanCode(htmlEditor.getValue());
    const css = cleanCode(cssEditor.getValue());
    
    const olPattern = /<ol>\s*<li>.*<\/li>\s*<li>.*<\/li>\s*<li>.*<\/li>\s*<\/ol>/s; 
    const olValid = olPattern.test(html);
  
    const cssValid = /list-style-type:\s*upper-roman\s*;/.test(css);
  
    function validateCSSBlocks(cssCode) {
      const openBraces = (cssCode.match(/\{/g) || []).length;
      const closeBraces = (cssCode.match(/\}/g) || []).length;
      return openBraces === closeBraces;
    }
  
    const isValidStructure = validateCSSBlocks(css);
    if (!isValidStructure) {
      setErrorFeedback("Upewnij się, że wszystkie sekcje są poprawnie zamknięte klamrami.");
      nextLevelButton.style.display = "none";
      return;
    }
  
    if (olValid && cssValid) {
      setSuccessFeedback("Gratulacje! Utworzyłeś uporządkowaną listę i zmieniłeś styl numeracji na rzymski.");
      nextLevelButton.style.display = "block"; 
    } else {
      setErrorFeedback("Upewnij się, że masz uporządkowaną listę <ol> z trzema elementami <li> oraz ustaw styl numeracji na 'upper-roman' w CSS.");
      nextLevelButton.style.display = "none"; 
  }
  }
  
function checkLevel6() {
    const html = cleanCode(htmlEditor.getValue()); 
    const css = cleanCode(cssEditor.getValue()); 
    
    const ulPattern = /<ul>\s*<li>.*<\/li>\s*<li>.*<\/li>\s*<li>.*<\/li>\s*<li>.*<\/li>\s*<\/ul>/s; // 's' flag dla wieloliniowego dopasowania
    const ulValid = ulPattern.test(html);
  
    const cssValid = /list-style-type:\s*circle\s*;/.test(css);
  
    function validateCSSBlocks(cssCode) {
      const openBraces = (cssCode.match(/\{/g) || []).length;
      const closeBraces = (cssCode.match(/\}/g) || []).length;
      return openBraces === closeBraces;
    }
  
    const isValidStructure = validateCSSBlocks(css);
    if (!isValidStructure) {
      setErrorFeedback("Upewnij się, że wszystkie sekcje są poprawnie zamknięte klamrami.");
      nextLevelButton.style.display = "none";
      return;
    }
  
    if (ulValid && cssValid) {
      setSuccessFeedback("Gratulacje! Utworzyłeś nieuporządkowaną listę i zmieniłeś styl ikon na 'circle'.");
      nextLevelButton.style.display = "block"; 
    } else {
      setErrorFeedback("Upewnij się, że masz nieuporządkowaną listę <ul> z czterema elementami <li> oraz ustaw styl ikon na 'circle' w CSS.");
      nextLevelButton.style.display = "none"; 
    }
  }
  
function checkLevel7() {
    const html = cleanCode(htmlEditor.getValue()); 
    
    const linkPattern = /<a\s+href=["'][^"']*["'][^>]*>.+<\/a>/;
  
    if (linkPattern.test(html)) {
      setSuccessFeedback("Brawo! Dodałeś link na stronie.");
      nextLevelButton.style.display = 'block'; 
    } else {
      setErrorFeedback("Dodaj link HTML za pomocą znacznika <a href=\"\" ></a>. Upewnij się, że atrybut href zawiera adres URL oraz że wewnątrz linku jest tekst.");
      nextLevelButton.style.display = 'none';
    }
  }
  
function checkLevel8() {
    const currentHTML = htmlEditor.getValue();

    const headerTest = /<header>[\s\S]*<\/header>/;
    const navTest = /<nav>[\s\S]*<\/nav>/;
    const ulTest = /<ul>[\s\S]*<\/ul>/;
    const liTest = /<li>[\s\S]*<\/li>/;
    const aTest = /<a href="[^"]+">[\s\S]*<\/a>/; 
    const h1Test = /<h1>[\s\S]*<\/h1>/;
    const pTest = /<p>[\s\S]*<\/p>/;

    const isValid = headerTest.test(currentHTML) &&
    navTest.test(currentHTML) &&
    ulTest.test(currentHTML) &&
    liTest.test(currentHTML) &&
    aTest.test(currentHTML) &&
    h1Test.test(currentHTML) &&
    pTest.test(currentHTML);

    if (isValid) {
        setSuccessFeedback("Brawo! Udało Ci się stworzyć poprawny nagłówek!");
        nextLevelButton.style.display = "block"; 
    } else {
        setErrorFeedback("Sprawdź kod HTML i spróbuj ponownie.");
        nextLevelButton.style.display = "none"; 
    }
}

function checkLevel9() {
  const currentHTML = htmlEditor.getValue();
  const sectionTest = /<section[^>]*>[\s\S]*<\/section>/g; 
  const sections = currentHTML.match(sectionTest);
  const isValid = sections && sections.length >= 1;

  if (isValid) {
      setSuccessFeedback("Brawo! Udało Ci się stworzyć co najmniej jedną poprawną sekcję!");
      nextLevelButton.style.display = "block"; 
  } else {
      setErrorFeedback("Sprawdź kod HTML i spróbuj ponownie. Upewnij się, że masz przynajmniej jedną sekcję.");
      nextLevelButton.style.display = "none"; 
  }
}

function checkLevel10() {
  const currentHTML = new DOMParser().parseFromString(htmlEditor.getValue(), 'text/html');
  const sections = currentHTML.querySelectorAll('section'); 

  let allSectionsValid = true;

  sections.forEach((section, index) => {
    if (section.innerHTML.trim() === "") {
      allSectionsValid = false;
    }
  });

  if (allSectionsValid) {
    setSuccessFeedback("Wszystkie sekcje są wypełnione!");
    nextLevelButton.style.display = "block";
    } else {
      setErrorFeedback("Sprawdź kod, czy wszystkie sekcje są wypełnione poprawnie!");
      nextLevelButton.style.display = "none";  }
}

function checkLevel11() {
  const currentHTML = htmlEditor.getValue();

  const isFooterIncludes = currentHTML.includes('<footer>') && currentHTML.includes('</footer>');

   if (isFooterIncludes) {
      setSuccessFeedback("Brawo! Stworzyłeś poprawną stopkę!");
      nextLevelButton.style.display = "block"; 
  } else {
      setErrorFeedback("Sprawdź kod HTML i spróbuj ponownie.");
      nextLevelButton.style.display = "none"; 
  }
}

function checkLevel12() {
  const css = cleanCode(cssEditor.getValue());

  const bodyBackgroundColorTest = /body\s*\{[^}]*background-color\s*:\s*([^;]+)\s*;[^}]*\}/;

  const match = css.match(bodyBackgroundColorTest);

  function isValidColor(color) {
      const colorHexRegex = /^#[0-9a-fA-F]{3,6}$/;  
      const colorRgbRegex = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/;  
      return colorHexRegex.test(color) || colorRgbRegex.test(color);
  }

  function isNotBlackColor(color) {
      const colorHexRegex = /^#(?:000000|000)$/; 
      const colorRgbRegex = /^rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)$/; 
      return !(colorHexRegex.test(color) || colorRgbRegex.test(color));
  }

  if (match) {
      const color = match[1].trim();

      if (isValidColor(color)) {
          if (isNotBlackColor(color)) {
              setSuccessFeedback("Brawo! Udało Ci się ustawić kolor tła w formacie HEX lub RGB.");
              nextLevelButton.style.display = "block"; 
          } else {
              setErrorFeedback("Kolor czarny jest zabroniony. Wybierz inny kolor.");
              nextLevelButton.style.display = "none"; 
          }
      } else {
          setErrorFeedback("Kolor tła jest niepoprawny. Upewnij się, że używasz koloru w formacie HEX (#ff0000) lub RGB (rgb(255, 0, 0)).");
          nextLevelButton.style.display = "none"; 
      }
  } else {
      setErrorFeedback("Sprawdź kod CSS i upewnij się, że sekcja body zawiera właściwość background-color w formacie HEX lub RGB.");
      nextLevelButton.style.display = "none"; 
  }
}

function checkLevel13() {
  const currentCSS = cleanCode(cssEditor.getValue());
  const bodyTest = /body\s*\{\s*(?=.*font-family:\s*[^;]+;)(?=.*margin:\s*[^;]+;)(?=.*padding:\s*[^;]+;)(?=.*background-color:\s*[^;]+;)[^}]*\}/;

  function isValidFontFamily(value) {
      return /^[a-zA-Z0-9\s,\-]+$/.test(value);
  }

  function isValidMarginPadding(value) {
      return /^(\d+(\.\d+)?(px|em|rem|%)|auto)$/.test(value);
  }

  function isValidColor(color) {
      const colorHexRegex = /^#[0-9a-fA-F]{3,6}$/;  
      const colorRgbRegex = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/;  
      return colorHexRegex.test(color) || colorRgbRegex.test(color);
  }

  function isNotBlackColor(color) {
      const colorHexRegex = /^#(?:000000|000)$/; 
      const colorRgbRegex = /^rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)$/; 
      return !(colorHexRegex.test(color) || colorRgbRegex.test(color));
  }

  function isValidBodyProperties(css) {
      const fontFamilyMatch = css.match(/font-family:\s*([^;]+);/);
      const marginMatch = css.match(/margin:\s*([^;]+);/);
      const paddingMatch = css.match(/padding:\s*([^;]+);/);
      const backgroundColorMatch = css.match(/background-color:\s*([^;]+);/);

      return (
          fontFamilyMatch && isValidFontFamily(fontFamilyMatch[1].trim()) &&
          marginMatch && isValidMarginPadding(marginMatch[1].trim()) &&
          paddingMatch && isValidMarginPadding(paddingMatch[1].trim()) &&
          backgroundColorMatch && isValidColor(backgroundColorMatch[1].trim()) && isNotBlackColor(backgroundColorMatch[1].trim())
      );
  }

  const isValid = bodyTest.test(currentCSS) && isValidBodyProperties(currentCSS);

  if (isValid) {
      setSuccessFeedback("Brawo! Udało Ci się ustawić wszystkie wymagane właściwości dla body z poprawnymi wartościami.");
      nextLevelButton.style.display = "block"; 
  } else {
      setErrorFeedback("Sprawdź kod CSS i upewnij się, że sekcja body zawiera poprawne wartości dla margin, padding, font-family oraz background-color.");
      nextLevelButton.style.display = "none"; 
  }
}

function checkLevel14() {
  const currentCSS = cleanCode(cssEditor.getValue());

  if (!validateCSSBlocks(currentCSS)) {
    setErrorFeedback("Kod CSS zawiera błędy składniowe (niezamknięte nawiasy klamrowe).");
    nextLevelButton.style.display = "none";
    return;
  }
  function validateCSSBlocks(cssCode) {
    const openBraces = (cssCode.match(/\{/g) || []).length;
    const closeBraces = (cssCode.match(/\}/g) || []).length;
    return openBraces === closeBraces;
  }
  
  function isValidColor(color) {
    const colorHexRegex = /^#[0-9a-fA-F]{3,6}$/;
    const colorRgbRegex = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/;
    return colorHexRegex.test(color) || colorRgbRegex.test(color);
  }
  
  function isValidPaddingMargin(value) {
    return /^(\d+(\.\d+)?(px|em|rem|%)|auto)$/.test(value);
  }
  
  function isValidBoxShadow(value) {
    const boxShadowRegex = /^(\d+(\.\d+)?px\s*){2,4}rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\)$/;
    return boxShadowRegex.test(value);
  }
  
  
  function isValidColor(color) {
    const colorHexRegex = /^#[0-9a-fA-F]{3,6}$/;
    const colorRgbRegex = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/;
    return colorHexRegex.test(color) || colorRgbRegex.test(color);
  }
  
  function isValidPaddingMargin(value) {
    return /^(\d+(\.\d+)?(px|em|rem|%)|auto)$/.test(value);
  }
  
  function isValidBoxShadow(value) {
    const boxShadowRegex = /^(\d+(\.\d+)?px\s*){2,4}rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\)$/;
    return boxShadowRegex.test(value);
  }

  const tests = [
    {
      selector: 'header',
      rules: [
        { property: 'background-color', isValid: isValidColor },
        { property: 'color', isValid: isValidColor },
        { property: 'padding', isValid: isValidPaddingMargin },
        { property: 'text-align', isValid: value => /^(left|right|center|justify)$/.test(value) }
      ]
    },
    {
      selector: 'section',
      rules: [
        { property: 'padding', isValid: isValidPaddingMargin },
        { property: 'margin', isValid: isValidPaddingMargin },
        { property: 'background-color', isValid: isValidColor },
        { property: 'border-radius', isValid: value => /^\d+(\.\d+)?(px|em|rem|%)$/.test(value) },
        { property: 'box-shadow', isValid: isValidBoxShadow }
      ]
    },
    {
      selector: 'footer',
      rules: [
        { property: 'text-align', isValid: value => /^(left|right|center|justify)$/.test(value) },
        { property: 'padding', isValid: isValidPaddingMargin },
        { property: 'background-color', isValid: isValidColor }
      ]
    }
  ];

  const isValid = tests.every(test => {
    const regex = new RegExp(`${test.selector}\\s*\\{[^}]*\\}`, 'i');
    const match = currentCSS.match(regex);
    if (!match) return false;

    return test.rules.every(rule => {
      const ruleMatch = currentCSS.match(new RegExp(`${test.selector}\\s*\\{[^}]*${rule.property}:\\s*([^;]+);`));
      return ruleMatch && rule.isValid(ruleMatch[1].trim());
    });
  });

  if (isValid) {
    setSuccessFeedback("Brawo! Udało Ci się ustawić wszystkie wymagane właściwości dla header, section i footer z poprawnymi wartościami.");
    nextLevelButton.style.display = "block";
  } else {
    setErrorFeedback("Sprawdź kod CSS i upewnij się, że sekcje header, section i footer zawierają poprawne wartości dla wszystkich wymaganych właściwości.");
    nextLevelButton.style.display = "none";
  }
}

function checkLevel15() {
  const currentCSS = cleanCode(cssEditor.getValue());

  function validateCSSBlocks(cssCode) {
    const openBraces = (cssCode.match(/\{/g) || []).length;
    const closeBraces = (cssCode.match(/\}/g) || []).length;
    return openBraces === closeBraces;
  }
  if (!validateCSSBlocks(currentCSS)) {
    setErrorFeedback("Upewnij się, że wszystkie sekcje są poprawnie zamknięte klamrami.");
    nextLevelButton.style.display = "none";
    return;
  }
  const navTest = /nav\s*ul\s*\{\s*(?=.*list-style\s*:\s*none)(?=.*padding\s*:\s*0)[^}]*\}/g;
  const liTest = /nav\s*ul\s*li\s*\{\s*(?=.*display\s*:\s*(inline|none|block|flex|inline-block))(?=.*margin\s*:\s*0\s*10px)[^}]*\}/g;
  const aTest = /nav\s*ul\s*li\s*a\s*\{\s*(?=.*color\s*:\s*[^;]+)(?=.*text-decoration\s*:\s*none)[^}]*\}/g;
  
  
  
  
  const isValidA = aTest.test(currentCSS);
  const isValidLi = liTest.test(currentCSS);
  const isValidNav = navTest.test(currentCSS);
  if (isValidNav && isValidLi && isValidA) {
    setSuccessFeedback("Brawo! Udało Ci się ustawić style dla nawigacji.");
    nextLevelButton.style.display = "block";
  } else {
    setErrorFeedback("Sprawdź kod CSS i upewnij się, że ustawiłeś style dla nawigacji.");
    nextLevelButton.style.display = "none";
  }
}

function checkLevel16() {
  const css = cleanCode(cssEditor.getValue());
  const h2Test = /h2\s*\{\s*(?=.*color\s*:\s*[^;]+)[^}]*\}/g;  
  const tableTest = /table\s*\{\s*(?=.*width\s*:\s*[^;]+)(?=.*border-collapse\s*:\s*(collapse|separate))[^}]*\}/g;  
  const table2Test = /table,\s*th,\s*td\s*\{\s*(?=.*border\s*:\s*[^;]+)[^}]*\}/g;  
  const thTest = /th,\s*td\s*\{\s*(?=.*padding\s*:\s*[^;]+)(?=.*text-align\s*:\s*(left|center|right))[^}]*\}/g; 

  function validateCSSBlocks(cssCode) {
    const openBraces = (cssCode.match(/\{/g) || []).length;
    const closeBraces = (cssCode.match(/\}/g) || []).length;
    return openBraces === closeBraces;
  }

  const isValidStructure = validateCSSBlocks(css);
  if (!isValidStructure) {
    setErrorFeedback("Upewnij się, że wszystkie sekcje są poprawnie zamknięte klamrami.");
    nextLevelButton.style.display = "none";
    return;
  }

  const isValidH2 = h2Test.test(css);
  const isValidTable = tableTest.test(css);
  const isValidTable2 = table2Test.test(css);
  const isValidTh = thTest.test(css);  
  if (isValidH2 && isValidTable && isValidTable2 && isValidTh) {
    setSuccessFeedback("Gratulacje! Utworzyłeś uporządkowaną listę i zmieniłeś styl numeracji.");
    nextLevelButton.style.display = "block"; 
  } else {
    setErrorFeedback("Sprawdź kod CSS i upewnij się, że ustawiłeś wszystkie wymagane właściwości i zamknąłeś sekcje klamrami.");
    nextLevelButton.style.display = "none"; 
  }
}

function checkLevel17() {
  //DOKONCZYC
}





  // Funkcja zmieniająca poziom
  function goToNextLevel() {
    currentLevel++;
    if (currentLevel === 2) {
      setInstructions(currentLevel);
      checkLevel2(); 
      cssEditor.setValue(`h1 {
      }`);
    } else if (currentLevel === 3) {
      setInstructions(currentLevel);
      checkLevel3(); 
    } else if (currentLevel === 4) {
      setInstructions(currentLevel);
      checkLevel4(); 
    } else if (currentLevel === 5) {
      setInstructions(currentLevel);
      checkLevel5();
    } else if (currentLevel === 6) {
      setInstructions(currentLevel);
      checkLevel6();
    } else if (currentLevel === 7) {
      setInstructions(currentLevel);
      checkLevel7();
    }else if (currentLevel === 8) {
      setInstructions(currentLevel);
      htmlEditor.setValue(""); // Czyszczenie zawartości HTML
      cssEditor.setValue(""); // Czyszczenie zawartości CSS
      checkLevel8(); 
    }else if (currentLevel === 9) {
      setInstructions(currentLevel);
      checkLevel9(); 
    }else if(currentLevel === 10){
      setInstructions(currentLevel);
      checkLevel10(); 
    }else if(currentLevel === 11){
      setInstructions(currentLevel);
      checkLevel11(); 
    }else if(currentLevel === 12){
      setInstructions(currentLevel);
      checkLevel12(); 
    }else if(currentLevel === 13){
      setInstructions(currentLevel);
      checkLevel13(); 
    }else if(currentLevel === 14){
      setInstructions(currentLevel);
      checkLevel14();
    }else if(currentLevel === 15){
      setInstructions(currentLevel);
      checkLevel15();
    }else if (currentLevel === 16) {
      setInstructions(currentLevel);
      checkLevel16(); 
    }else if (currentLevel === 17) {
      setInstructions(currentLevel);
      checkLevel17(); 
    }
      saveCurrentLevelToLocalStorage();
  }

  //Funkcje sprawdzające zmiany w edytorze HTML na poszczególnych poziomach
  htmlEditor.on('change', () => {
    updatePreview();
    if (currentLevel === 1) {
      checkLevel1(); 
    } else if (currentLevel === 2) {
      checkLevel2(); 
    } else if (currentLevel === 3) {
      checkLevel3(); 
    } else if (currentLevel === 4) {
      checkLevel4();
    } else if (currentLevel === 5) {
      checkLevel5(); 
    } else if (currentLevel === 6) {
      checkLevel6(); 
    } else if (currentLevel === 7) {
      checkLevel7(); 
    } else if (currentLevel === 8) {
      checkLevel8(); 
    } else if (currentLevel === 9) {
      checkLevel9(); 
    } else if (currentLevel === 10) {
      checkLevel10(); 
    } else if (currentLevel === 11) {
      checkLevel11(); 
    } else if (currentLevel === 12) {
      checkLevel12(); 
    } else if (currentLevel === 13) {
      checkLevel13(); 
    } else if (currentLevel === 14) {
      checkLevel14(); 
    } else if (currentLevel === 15) {
      checkLevel15(); 
    } else if (currentLevel === 16) {
      checkLevel16(); 
    } else if (currentLevel === 17) {
      checkLevel17(); 
    }
    saveToLocalStorage();
  });
  //Funkcje sprawdzające zmiany w edytorze CSS na poszczególnych poziomach
  cssEditor.on('change', () => {
    updatePreview();
    if (currentLevel === 2) {
      checkLevel2(); 
    } else if (currentLevel === 3) {
      checkLevel3(); 
    } else if (currentLevel === 5) {
      checkLevel5(); 
    } else if (currentLevel === 6) {
      checkLevel6(); 
    } else if (currentLevel === 7) {
      checkLevel7(); 
    } else if (currentLevel === 8) {
      checkLevel8(); 
    } else if(currentLevel === 9){
      checkLevel9();
    } else if(currentLevel === 10){
      checkLevel10();
    } else if(currentLevel === 11){
      checkLevel11();
    } else if (currentLevel === 12) {
      checkLevel12(); 
    } else if (currentLevel === 13) {
      checkLevel13(); 
    } else if (currentLevel === 14) {
      checkLevel14(); 
    } else if (currentLevel === 15) {
      checkLevel15(); 
    } else if (currentLevel === 16) {
      checkLevel16(); 
    } else if (currentLevel === 17) {
      checkLevel17(); 
    }
      saveToLocalStorage();
  });

  //Funkcje wyświetlające instrukcje dla poszczególnych poziomów
  setInstructions(currentLevel);
  function setInstructions(level) {
    if (level === 1) {
      instructions.innerHTML = `
      <h2>Poziom 1: Utwórz nagłówek 1 stopnia</h2>
      <p>Twoje zadanie to utworzenie nagłówka 1 stopnia (<code>&lt;h1&gt;</code>) w sekcji <code>&lt;body&gt;</code>, pamiętaj o zamknięciu. Wprowadź odpowiedni kod HTML, aby zakończyć poziom.</p>`;
    
    } else if (level === 2) {
      instructions.innerHTML = `
        <h2>Poziom 2: Wyśrodkowanie tekstu</h2>
        <p>Twoje zadanie to wyśrodkowanie nagłówka 1 stopnia za pomocą CSS. Użyj odpowiednich właściwości CSS, takich jak <code>text-align: center;</code>, aby to osiągnąć.</p>`;
    } else if (level === 3) {
      instructions.innerHTML = `
        <h2>Poziom 3: Dodaj tło</h2>
        <p>Twoje zadanie to dodać tło do strony. Użyj właściwości CSS <code>background-color</code>, aby ustawić tło strony. Możesz użyć zarówno angielskich nazw kolorów, jak i kodów HEX.</p>`;
    } else if (level === 4) {
      instructions.innerHTML = `
        <h2>Poziom 4: Dodaj obrazek</h2>
        <p>Twoje zadanie to dodać obrazek do strony. Użyj właściwości html (<code>&lt;img src="link"&gt;</code>), aby dodać obrazek do strony.</p>`;
    } else if (level === 5) {
      instructions.innerHTML = `
        <h2>Poziom 5: Uporządkowane listy</h2>
        <p>Twoje zadanie to dodanie uporządkowanej listy (<code>&lt;ol&gt;</code>) z trzema elementami (<code>&lt;li&gt;</code>) oraz zmiana stylu numeracji na rzymską w CSS (<code>list-style-type: upper-roman;</code>).</p>`;
    } else if (level === 6) {
      instructions.innerHTML = `
        <h2>Poziom 6: Nieuporządkowane listy z ikonami</h2>
        <p>Dodaj nieuporządkowaną listę (<code>&lt;ul&gt;</code>) z czterema elementami (<code>&lt;li&gt;</code>). Ustaw styl ikon na <code> ul{ list-style-type: circle;
</code>} za pomocą CSS.</p>`;
    } else if (level === 7) {
      instructions.innerHTML = `
        <h2>Poziom 7: Dodawanie linków</h2>
        <p>Dodaj link na stronie za pomocą znacznika <code>&lt;a href=""&gt;</code>. Link może prowadzić do dowolnej strony, np. Google.</p>`;
    }else if(level === 8){
      instructions.innerHTML = `
    <h2>Poziom 8: Pasek nawigacji</h2>
    <p>Zabawa się skończyła! Bierzemy się za pisanie porządnej strony internetowej z prawdziwego zdarzenia.</p>
    <p>W tym zadaniu musisz stworzyć element <code>&lt;header&gt;</code>, który będzie zawierał pasek nawigacji, czyli część strony służącą do nawigacji i przechodzenia po poszczególnych stronach z dowolną liczbą linków, na przykład:</p>
    <pre>
        <code>
&lt;nav&gt;
    &lt;ul&gt;
        &lt;li&gt;&lt;a href="link"&gt;Home&lt;/a&gt;&lt;/li&gt;
        &lt;li&gt;&lt;a href="link"&gt;Services&lt;/a&gt;&lt;/li&gt;
    &lt;/ul&gt;
&lt;/nav&gt;
        </code>
    </pre>
    <p>Poniżej nawigacji dodaj tytuł strony w elemencie <code>&lt;h1&gt;</code> oraz paragraf w elemencie <code>&lt;p&gt;</code>.</p>
    <p>Twoim zadaniem jest stworzenie takiej struktury z dowolnymi treściami w tytule oraz paragrafie. Pamiętaj, że elementy <code>&lt;ul&gt;</code> i <code>&lt;li&gt;</code> muszą być poprawnie zapisane, a linki <code>&lt;a&gt;</code> muszą być poprawnie zamknięte.</p>
`;

    }else if(level === 9){
      instructions.innerHTML = `
  <h2>Poziom 9: Sekcje</h2>
  <p>W tym zadaniu Twoim celem jest stworzenie co najmniej jednej sekcji <code>&lt;section&gt;</code> w HTML. 
  Sekcje mogą zawierać dowolną treść, ale muszą być poprawnie zapisane. Przykład:</p>
  <pre>
      <code>
&lt;section&gt;
  &lt;h2&gt;Nagłówek sekcji&lt;/h2&gt;
&lt;/section&gt;
      </code>
  </pre>
  <p>W każdej sekcji może znaleźć się dowolna treść. Upewnij się, że sekcja jest poprawnie otwarta i zamknięta.</p>
  <p>Zastanów się ile sekcji będziesz potrzebował na swojej stronie.</p>
`;
    }else if(level === 10){
      instructions.innerHTML = `
  <h2>Poziom 10: Zawartości Sekcji</h2>
  <p>W tym zadaniu musisz wypełnić sekcje utworzone we wcześniejszym zadaniu, <code>&lt;section&gt;</code> w HTML.</p>
  <p>Pamiętaj, że każda sekcja musi być poprawnie otwarta i zamknięta.</p>
  <p>Do każdej sekcji umieścić możesz co tylko zechcesz od paragrafów, przez tabele aż po obrazki i nie tylko! Ogranicza cię tylko twoja wyobraźnia... </p>
  <p>... no i zdolności pisania stron.</p> 
  `;
    }else if(level === 11){
      instructions.innerHTML = `
  <h2>Poziom 11: Stwórz stopkę (footer)</h2>
  <p>Twoim zadaniem jest stworzenie elementu <code>&lt;footer&gt;</code> w HTML.</p>
  <p>Stopka strony to element, który zazwyczaj znajduje się na dole strony i zawiera ważne informacje, takie jak:</p>
  <ul>
      <li>Informacje o autorze strony</li>
      <li>Linki do stron społecznościowych</li>
      <li>Informacje kontaktowe</li>
      <li>Linki do polityki prywatności lub regulaminu</li>
      <li>Copyright (np. <code>&copy; 2024 Twoja Firma</code>)</li>
      <li>Adresy e-mail, numery telefonów lub inne dane kontaktowe</li>
  </ul>
  <p>Możesz dodać dowolne elementy, które uznasz za potrzebne, ale pamiętaj, że stopka powinna być odpowiednio zamknięta, czyli musisz zawrzeć zarówno <code>&lt;footer&gt;</code> na początku, jak i <code>&lt;/footer&gt;</code> na końcu.</p>
  <p>Poniżej przykład poprawnie zapisanej stopki:</p>
  <pre>
      <code>
&lt;footer&gt;
  &lt;p&gt;© 2024 Twoja Firma. Wszelkie prawa zastrzeżone.&lt;/p&gt;
  &lt;p&gt;Kontakt: example@twojafirma.com&lt;/p&gt;
&lt;/footer&gt;
      </code>
  </pre>
  <p>Upewnij się, że w stopce zawrzesz odpowiednie informacje, a tagi <code>&lt;footer&gt;</code> i <code>&lt;/footer&gt;</code> będą poprawnie zapisane.</p>
  `;
    }else if(level === 12){
      instructions.innerHTML = `
      <h2>Poziom 12: Zmiana koloru tła</h2>
      <p>W tym zadaniu musisz zmienić kolor tła całej strony za pomocą CSS. Kolor tła jest ważnym elementem, który wpływa na estetykę i funkcjonalność strony internetowej.</p>
      <p>Możesz wybrać dowolny kolor(kolor czarny jest zabroniony), ale pamiętaj, że tło powinno być przyjemne dla oka i nie przytłaczać treści strony. Poniżej znajdziesz kilka propozycji kolorów tła, które możesz zastosować:</p>
      <ul>
          <li><code>background-color: #f4f4f4;</code> - delikatny szary kolor tła, który sprawia, że tekst jest dobrze widoczny.</li>
          <li><code>background-color: #ffffff;</code> - klasyczna biel, nadaje stronie czystości i przestronności.</li>
          <li><code>background-color: #e0e0e0;</code> - lekki szary kolor, subtelny, ale nowoczesny.</li>
          <li><code>background-color: #ffeb3b;</code> - jasny żółty, energetyczny i przyciągający uwagę.</li>
          <li><code>background-color: #4caf50;</code> - zielony, uspokajający kolor.</li>
          <li><code>background-color: #2196f3;</code> - jasny niebieski, chłodny i profesjonalny.</li>
      </ul>
      <p>Możesz również używać wartości RGB, np. <code>background-color: rgb(255, 0, 0);</code>, lub wartości HSL, np. <code>background-color: hsl(120, 100%, 50%);</code>.</p>
      <p>Przykład, jak zmienić kolor tła strony:</p>
      <pre>
          <code>
body {
  background-color: #f4f4f4; 
}
          </code>
      </pre>
      <p>Twoim zadaniem jest zmiana koloru tła w arkuszu CSS. Wybierz kolor, który najlepiej pasuje do Twojej strony i spraw, aby całość wyglądała atrakcyjnie!</p>
  `;
    }else if(level === 13){
      instructions.innerHTML = `
        <h2>Poziom 13: Ustawienie marginesów, paddingu i czcionki</h2>
        <p>W tym zadaniu musisz ustawić podstawowe właściwości CSS dla elementu <code>body</code>.</p>
        <p>Wymagane właściwości to:</p>
        <ul>
            <li><code>font-family:</code> – ustawienie czcionki, np. <code>Arial</code>, <code>sans-serif</code> lub dowolnej innej czcionki.</li>
            <li><code>margin:</code> – ustawienie marginesu (odstępu) wokół elementu, np. <code>0</code>, <code>10px</code>, <code>5%</code> itd.</li>
            <li><code>padding:</code> – ustawienie paddingu (wewnętrznego odstępu), np. <code>10px</code>, <code>5%</code> itd.</li>
        </ul>
        <p>Te trzy właściwości wpływają na wygląd strony:</p>
        <ul>
            <li><strong>font-family</strong> – określa, jaka czcionka będzie używana na stronie. Można wybrać czcionki systemowe, jak <code>Arial</code> lub <code>serif</code>, lub czcionki zewnętrzne, jak Google Fonts.</li>
            <li><strong>margin</strong> – kontroluje przestrzeń wokół elementu. Może być ustawiona na wartość zerową, aby element przylegał do innych, lub na większą, by oddzielić elementy.</li>
            <li><strong>padding</strong> – ustawia wewnętrzną przestrzeń w elemencie, np. pomiędzy tekstem a krawędzią kontenera. Jest to ważne do poprawnego rozmieszczenia treści na stronie.</li>
        </ul>
        <p>Twoim zadaniem jest ustawienie tych trzech właściwości w pliku CSS dla <code>body</code>, np.:</p>
        <pre>
            <code>
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}
            </code>
        </pre>
        <p>Użyj odpowiednich wartości dla każdego z tych atrybutów i spraw, by Twoja strona wyglądała dobrze!</p>
    `;
    }else if(level === 14){
      instructions.innerHTML = `
    <h2>Poziom 14: Ustawienie stylów dla <code>header</code>, <code>section</code> i <code>footer</code></h2>
    <p>W tym zadaniu musisz ustawić właściwości CSS dla trzech elementów: <code>header</code>, <code>section</code> oraz <code>footer</code>.</p>
    <p>Oto jakie właściwości musisz dodać:</p>

    <h3>1. Ustawienia dla <code>header</code></h3>
    <p>W przypadku <code>header</code> musisz ustawić następujące właściwości:</p>
    <ul>
        <li><code>background-color:</code> – Ustaw kolor tła dla nagłówka (np. <code>#333</code> dla ciemnego tła).</li>
        <li><code>color:</code> – Ustaw kolor tekstu w nagłówku (np. <code>#fff</code> dla białego tekstu na ciemnym tle).</li>
        <li><code>padding:</code> – Ustaw odstępy wewnętrzne w nagłówku (np. <code>20px 0</code> dla 20px odstępu na górze i dole).</li>
        <li><code>text-align:</code> – Ustaw wyrównanie tekstu w nagłówku (np. <code>center</code> dla wyśrodkowanego tekstu).</li>
    </ul>

    <h3>2. Ustawienia dla <code>section</code></h3>
    <p>W przypadku <code>section</code> musisz ustawić następujące właściwości:</p>
    <ul>
        <li><code>padding:</code> – Ustaw wewnętrzne odstępy w sekcji (np. <code>20px</code> dla 20px odstępu wewnątrz sekcji).</li>
        <li><code>margin:</code> – Ustaw odstępy zewnętrzne wokół sekcji (np. <code>20px 0</code> dla odstępu 20px z góry i dołu).</li>
        <li><code>background-color:</code> – Ustaw kolor tła sekcji (np. <code>#fff</code> dla białego tła).</li>
        <li><code>border-radius:</code> – Ustaw zaokrąglenie rogów sekcji (np. <code>5px</code> dla lekko zaokrąglonych rogów).</li>
        <li><code>box-shadow:</code> – Ustaw cień dla sekcji (np. <code>0 0 10px rgba(0, 0, 0, 0.1)</code> dla lekkiego cienia).</li>
    </ul>

    <h3>3. Ustawienia dla <code>footer</code></h3>
    <p>W przypadku <code>footer</code> musisz ustawić następujące właściwości:</p>
    <ul>
        <li><code>text-align:</code> – Ustaw wyrównanie tekstu w stopce (np. <code>center</code> dla wyśrodkowanego tekstu).</li>
        <li><code>padding:</code> – Ustaw odstępy wewnętrzne w stopce (np. <code>20px</code> dla 20px odstępu wewnętrznego).</li>
        <li><code>background-color:</code> – Ustaw kolor tła stopki (np. <code>#333</code> dla ciemnego tła).</li>
    </ul>

    <p>Przestestuj działanie kodu i dobierz odpowiednie wartości dla każdej z właściwości, aby strona wyglądała estetycznie i funkcjonalnie!</p>
`;

    }else if(level === 15){
      instructions.innerHTML = `
    <h2>Poziom 15: Ustawienie stylów dla <code>nav</code>, <code>ul</code>, <code>li</code> i <code>a</code></h2>
    <p>W tym zadaniu musisz ustawić właściwości CSS dla elementów nawigacyjnych: <code>nav</code>, <code>ul</code>, <code>li</code> oraz <code>a</code>.</p>
    <p>Oto jakie właściwości musisz dodać:</p>

    <h3>1. Ustawienia dla <code>nav ul</code></h3>
    <p>W przypadku <code>nav ul</code> musisz ustawić następujące właściwości:</p>
    <ul>
        <li><code>list-style:</code> – Usuń domyślne punkty listy z elementu <code>&lt;ul&gt;</code> (wartość: <code>none</code>).</li>
        <li><code>padding:</code> – Usuń wewnętrzne odstępy z elementu <code>&lt;ul&gt;</code> (wartość: <code>0</code>).</li>
    </ul>

    <h3>2. Ustawienia dla <code>nav ul li</code></h3>
    <p>W przypadku <code>nav ul li</code> musisz ustawić następujące właściwości:</p>
    <ul>
        <li><code>display:</code> – Ustaw sposób wyświetlania elementów listy <code>&lt;li&gt;</code> (wartość: <code>inline</code> sprawia, że elementy <code>&lt;li&gt;</code> będą wyświetlane obok siebie).</li>
        <li><code>margin:</code> – Ustaw odstępy zewnętrzne wokół każdego elementu <code>&lt;li&gt;</code> (np. <code>0 10px</code> dla odstępu 10px po lewej i prawej stronie).</li>
    </ul>

    <h3>3. Ustawienia dla <code>nav ul li a</code></h3>
    <p>W przypadku <code>nav ul li a</code> musisz ustawić następujące właściwości:</p>
    <ul>
        <li><code>color:</code> – Ustaw kolor tekstu linków <code>&lt;a&gt;</code> (np. <code>#fff</code> dla białego tekstu).</li>
        <li><code>text-decoration:</code> – Usuń podkreślenie z linków (wartość: <code>none</code>).</li>
    </ul>
`;


    }else if(level === 16){
      instructions.innerHTML = `
  <h2>Poziom 16: Ustawienie stylów dla nagłówków i tabeli</h2>
  <p>W tym zadaniu musisz ustawić style CSS dla elementów: <code>h2</code>, <code>table</code>, <code>th</code>, <code>td</code>.</p>
  <p>Oto jakie właściwości musisz dodać:</p>
  <ul>
      <li><code>color:</code> – ustaw kolor tekstu w nagłówku <code>&lt;h2&gt;</code>. Możesz wybrać dowolny kolor, np. <code>#333</code> dla ciemniejszego odcienia tekstu.</li>
  </ul>
  <h3>1. Ustawienia dla <code>table</code></h3>
  <p>W przypadku tabeli musisz ustawić następujące właściwości:</p>
  <ul>
      <li><code>width:</code> – ustaw szerokość tabeli. Możesz wybrać wartość w procentach (np. <code>100%</code>), px (np. <code>600px</code>) lub innych jednostkach.</li>
      <li><code>border-collapse:</code> – ustaw sposób wyświetlania granic tabeli. Możesz użyć wartości <code>collapse</code> (granice zleją się) lub <code>separate</code> (granice pozostaną oddzielne).</li>
      <li><code>border:</code> – ustaw obramowanie tabeli. Możesz wybrać kolor, szerokość i styl obramowania, np. <code>1px solid #ddd</code>.</li>
  </ul>
  <h3>2. Ustawienia dla nagłówków <code>th</code></h3>
  <p>W przypadku nagłówków tabeli (element <code>&lt;th&gt;</code>) musisz ustawić następujące właściwości:</p>
  <ul>
      <li><code>padding:</code> – ustaw wewnętrzne odstępy w komórkach nagłówka. Możesz wybrać dowolną wartość, np. <code>10px</code> lub <code>1em</code>.</li>
      <li><code>text-align:</code> – ustawia wyrównanie tekstu w komórkach nagłówka. Możesz wybrać jedną z wartości: <code>left</code>, <code>center</code> lub <code>right</code>.</li>
      <li><code>background-color:</code> – ustaw kolor tła nagłówków tabeli. Możesz wybrać np. <code>#f4f4f4</code> lub inny kolor tła, który pasuje do ogólnej kolorystyki strony.</li>
  </ul>
  <h3>3. Ustawienia dla komórek <code>td</code></h3>
  <p>W przypadku komórek tabeli (element <code>&lt;td&gt;</code>) musisz ustawić następujące właściwości:</p>
  <ul>
      <li><code>padding:</code> – ustawia wewnętrzne odstępy w komórkach. Wybierz wartość, np. <code>10px</code> lub <code>1em</code>, aby nadać komórkom odpowiednią przestrzeń.</li>
      <li><code>text-align:</code> – ustawia wyrównanie tekstu w komórkach. Możesz wybrać jedną z wartości: <code>left</code>, <code>center</code> lub <code>right</code>, aby dostosować tekst do odpowiedniego położenia w komórkach.</li>
      <li><code>border:</code> – ustawia obramowanie komórek tabeli. Może być to np. <code>1px solid #ddd</code>, aby komórki były otoczone cienką granicą o odpowiednim kolorze.</li>
  </ul>
  <p>Pamiętaj, że masz pełną swobodę w doborze wartości dla tych właściwości, ale ważne jest, aby strona była estetyczna i funkcjonalna. Dobrze dobrane style sprawią, że tabela będzie bardziej czytelna i łatwa do przeglądania.</p>
  <p>Zagnieżdżenie elementów w CSS pozwala na precyzyjne stylowanie specyficznych części strony, takich jak nagłówki tabeli czy komórki. Na przykład, <code>table, th, td</code> oznacza, że styl będzie stosowany do tabeli oraz do jej nagłówków i komórek.</p>
`;

    }else if (level === 17){
      instructions.innerHTML = `
EMPTY`;

    }
  }

  // Aktualizuj podgląd przy każdej zmianie w kodzie
  htmlCode.addEventListener('input', updatePreview);
  cssCode.addEventListener('input', updatePreview);
  updatePreview();



  //testowanie
  console.log(currentLevel)
  console.log(nextLevelButton);
  console.log("Przycisk widoczny:", nextLevelButton.style.display);

});