const bottomNumbers = document.getElementById("tmpNumbers"),
    topNumbers = document.getElementById("topTmpNumbers");
let isThereComma = false; // czy jest przecinek
let isthereProcent = false; // czy jest procent
let calculations = ""; //obliczenia nie widoczne
let tmpComma = false; // zapamietuje na stałe czy byl przecinek uzyty
let globalBlockProcent = false;//globalnie blokuje procenty
let afterSum = false; //po zsumowaniu zeby nie mozna bylo dalej operować
window.addEventListener('click', (el) => {
    //klikanie myszką
    if (el.target.className == "button" || el.target.className == "button BTNStrongComma" || el.target.className == "StrongComma") {
        //tutaj dodawanie odrazu liczby z przycisku
        writeNumber(el.target.textContent);
    } else if (el.target.className == "button signButton" && el.target.textContent == "/" || el.target.className == "line" || el.target.className == "spanPlus_minusBTN") {
        //tworzy liczbe ujemna lub dodatnia
        operationalSigns("+/-")
    } else if (el.target.className == "button specialFioletBTN" || el.target.className == "button specialPinkBTN" || el.target.className == "button signButton") {
        operationalSigns(el.target.textContent) // przyciski akcji
    }
})
window.addEventListener('keydown', (el) => {
    //klawiatura
    if (el.key == " ") {
        return false
    }else if(el.key == "Enter"){
        return false
    }
    if (el.key == 0 || el.key == 1 || el.key == 2 || el.key == 3 || el.key == 4 || el.key == 5 || el.key == 6 || el.key == 7 || el.key == 8 || el.key == 9 || el.key == ",") {
        writeNumber(el.key) //numery do funkcji która je pisze
    } else if (el.key == "Backspace" || el.key == "=" || el.key == "%" || el.key == "C" || el.key == "c" || el.key == "/" || el.key == "*" || el.key == "+" || el.key == "-") {
        operationalSigns(el.key); //wywoływanie akcji
    }
})
//funkcja akcji
function operationalSigns(sign) {
    let choosenSign = undefined;
    if (sign == "+" && bottomNumbers.innerHTML != 0 && afterSum == false ) {
        choosenSign = " + ";
    } else if (sign == "-" && bottomNumbers.innerHTML != 0 && afterSum == false) {
        choosenSign = " - ";
    } else if (sign == "/" && bottomNumbers.innerHTML != 0 && afterSum == false) {
        choosenSign = " / ";
    } else if (sign == "x" && bottomNumbers.innerHTML != 0 && afterSum == false || sign == "X" && bottomNumbers.innerHTML != 0  || sign == "*" && bottomNumbers.innerHTML != 0 ) {
        choosenSign = " * ";
    } else if (afterSum == false &&sign == "%" && bottomNumbers.innerHTML != 0 &&bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) != '-' && globalBlockProcent == false) {
        //dodaje % przy liczbie badź go odejmuje
        if (bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) != '%' && isthereProcent == false) {
            bottomNumbers.innerHTML = bottomNumbers.innerHTML + "%"
            isthereProcent = true;
            isThereComma = false;
        } else if (bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) == '%') {
            bottomNumbers.innerHTML = bottomNumbers.innerHTML.substring(0, bottomNumbers.innerHTML.length - 1)
            isthereProcent = false;
        }
    } else if (afterSum == false &&sign == "=" && bottomNumbers.innerHTML != "-" && topNumbers.innerHTML.length > 0  || afterSum == false && isthereProcent == true && sign == "=" && bottomNumbers.innerHTML != "0" && bottomNumbers.innerHTML != "-" ) {
        //obliczanie wyniku
        let result;
        if (isthereProcent == true && topNumbers.innerHTML == "") {
            //obliczanie samego procenta
            calculations = procent();
        } else if (isthereProcent == true) {
            //tylko to nie dziala
            //jesli jest procent to uzywam funkcji która sprawdza i oddaje odpowiednia liczbe
            calculations = makeComma(calculations.concat(procent())); // ostatnie połączenie tego co na górze z dolnymi liczbami
        } else if (isthereProcent == false && calculations.charAt(calculations.length - 2) == '/' && bottomNumbers.innerHTML == "0" || isthereProcent == false && calculations.charAt(calculations.length - 2) == '*' && bottomNumbers.innerHTML == "0") {
            result = "Nie wolno przez 0"
            //jesli chcemy podzielic/przemnożyć przez 0
        } else if (isthereProcent == false) {
            calculations = makeComma(calculations.concat(bottomNumbers.innerHTML)) ;// ostatnie połączenie tego co na górze z dolnymi liczbami // zamieniamy . na , uzywajac makeComma
        }
        calculations = eval(calculations);
        result = (Math.round(parseFloat(calculations) * 100000000) / 100000000).toString();//ograniczam i zaokraglam liczby
        topNumbers.innerHTML = topNumbers.innerHTML.concat(bottomNumbers.innerHTML + " = ") // dodaje = na koniec kodu w górnej linii
        let splitDot = result.split('.')
        if(splitDot[1] != undefined){
            //jesli nie bedzie przecinka to zeby nie dzielilo
            result = splitDot[0] + ',' + splitDot[1];
            result = result.replace(/\.?0+$/, '');//pozbywam sie zer niechcianych
        }else if(result.length == 0){
            result = "0"
        }else {
            result = calculations;
        }
         //wyświetlam wynik
        bottomNumbers.innerHTML = result;
        calculations = "";
        afterSum = true;
    } else if (sign == "+/-"&& afterSum == false ) {
        //dodaje lub zabieram znak -
        if (bottomNumbers.innerHTML.length == "1" && bottomNumbers.innerHTML.charAt(0) == '-') {
            bottomNumbers.innerHTML = "0"
        } else if (bottomNumbers.innerHTML == "0") {
            bottomNumbers.innerHTML = "-"
        } else if (bottomNumbers.innerHTML.charAt(0) != '-') {
            bottomNumbers.innerHTML = "-" + bottomNumbers.innerHTML
        } else if (bottomNumbers.innerHTML.charAt(0) == '-') {
            bottomNumbers.innerHTML = bottomNumbers.innerHTML.substring(1)
        }
    } else if (sign == "c"|| sign == "C" || sign == "Backspace" ) {
        //usuwa wszystko
        calculations = "";
        isthereProcent = false;
        isThereComma = false;
        tmpComma = false
        globalBlockProcent= false;
        afterSum = false;
        topNumbers.innerHTML = "";
        bottomNumbers.innerHTML = "0";
    }
    //po wybraniu znaku przenosi liczby na gore i czyści dolna linie
    if (choosenSign != undefined) {
     
        if (isthereProcent == true) {
            //obliczam procent odpowiedni i dodaje do obliczeń niewidocznych 
            calculations = calculations.concat(procent() + choosenSign);
            isthereProcent = false;
        } else if (isthereProcent == false) {
            //po prostu dodaje do obliczeń niewidocznych
            calculations = calculations.concat(bottomNumbers.innerHTML + choosenSign);
        }
        topNumbers.innerHTML = topNumbers.innerHTML.concat(bottomNumbers.innerHTML + choosenSign) // wyświetlam zmiany na górze
        bottomNumbers.innerHTML = "0" // zeruje dolną linie
        isThereComma = false;
        tmpComma = false;
    }
}
function writeNumber(number) {
    //wpisywanie numerów w dolnej linii
     if (number == ","&& afterSum == false && isthereProcent == true && isThereComma == true && bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) == ',' && bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 2) == '0') {
        isThereComma = false;
        bottomNumbers.innerHTML = bottomNumbers.innerHTML.substring(0, bottomNumbers.innerHTML.length - 2)
        //zabiera przecinek ale tylko jeśli jest za znakiem %
    } else if (number == ","&& afterSum == false && isThereComma == false  && bottomNumbers.innerHTML == "-"||number == "," && isThereComma == false  && bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) == '%') {
        isThereComma = true;
        tmpComma = true;
        bottomNumbers.innerHTML = bottomNumbers.innerHTML.concat("0,");
        //dodaje przecinek dokładnie to 0. po % 
        //ew dodaje 0. jak jest sam minus
    } else if (number == ","&& afterSum == false && isThereComma == false ) {
        //dodaje przecinek
        isThereComma = true;
        tmpComma = true;
        bottomNumbers.innerHTML = bottomNumbers.innerHTML.concat(",");
    } else if (number != ","&& afterSum == false && bottomNumbers.innerHTML == "0" ) {
        bottomNumbers.innerHTML = number.toString();
        //wpisywanie liczby jeśli na początku jest zero
    } else if (number != ","&& afterSum == false && bottomNumbers.innerHTML != "0" ) {
        //wpisywanie liczb klawiatura/myszka
        bottomNumbers.innerHTML = bottomNumbers.innerHTML.concat(number.toString());
    } else if (number == ","&& afterSum == false && bottomNumbers.innerHTML == "0."  && isThereComma == true) {
        bottomNumbers.innerHTML = "0";
        isThereComma = false;
        //zabiera przecinek gdy mamy zero na dolnej lini
    } else if (number == ","&& afterSum == false && bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) == ',' && bottomNumbers.innerHTML.length >= 2 && isThereComma == true) {
        isThereComma = false;
        bottomNumbers.innerHTML = bottomNumbers.innerHTML.substring(0, bottomNumbers.innerHTML.length - 1)
        //jeśli mamy kilka liczb i zabieramy przecinek
    }
}

function procent() {
    //Math.round(liczba * 100000000) / 100000000 zaokraglam do 8 miejsca po przecinku
    //tutaj jeszcze zamienic przecinek
    //obliczanie procentów
    globalBlockProcent= true;
    let tmp = bottomNumbers.innerHTML;
     tmp = makeComma(tmp);
    if (bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) == '%' && tmpComma == true && isthereProcent == true) {
      return ( Math.round((parseFloat(tmp) / 100) * 100000000) / 100000000).toString();
        //zwykly procent z liczby
    } else if (bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) == '%' && tmpComma == false && isthereProcent == true) {
       return ( Math.round((parseInt(tmp) / 100) * 100000000) / 100000000).toString();
        //zwykly procent z liczby no ale ,
    } else if (bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) != '%' && tmpComma == true && isthereProcent == true) {
        //obliczanie procentu z liczby od razu
        let numb = (tmp).split("%");
        return ( Math.round(((parseFloat(numb[0]) / 100) * parseFloat(numb[1])) * 100000000) / 100000000).toString();
    } else if (bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) != '%' && tmpComma == false && isthereProcent == true) {
        //obliczanie procentu z liczby od razu
        let numb = (tmp).split("%");
        return ( Math.round(((parseInt(numb[0]) / 100) * parseInt(numb[1])) * 100000000) / 100000000).toString();
    }
}

function makeComma(obj) {
    let commas = obj.split(",");
    let tmp;
    for (let i = 0; i < commas.length; i++) {
        if (i == 0) {
            tmp = commas[i]
        } else {
            tmp += "." + commas[i]
        }
    }
    return tmp;
}