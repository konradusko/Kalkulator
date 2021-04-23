const bottomNumbers = document.getElementById("tmpNumbers"),
    topNumbers = document.getElementById("topTmpNumbers");
let isThereComma = false; // czy jest przecinek
let isthereProcent = false; // czy jest procent
let calculations = ""; //obliczenia nie widoczne
let tmpComma = false; // zapamietuje na stałe czy byl przecinek uzyty
let block = false; // jeśli mamy wynik to blokuje przyciski do póki nie zresetujemy go "C"
window.addEventListener('click', (el) => {
    //klikanie myszką
    if (el.target.className == "button") {
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
    }
    if (el.key == 0 || el.key == 1 || el.key == 2 || el.key == 3 || el.key == 4 || el.key == 5 || el.key == 6 || el.key == 7 || el.key == 8 || el.key == 9 || el.key == ",") {
        writeNumber(el.key) //numery do funkcji która je pisze
    } else if (el.key == "Backspace" || el.key == "Enter" || el.key == "%" || el.key == "C" || el.key == "c" || el.key == "/" || el.key == "*" || el.key == "+" || el.key == "-") {
        operationalSigns(el.key); //wywoływanie akcji
    }
})
//funkcja akcji
function operationalSigns(sign) {
    let choosenSign = undefined;
    if (sign == "+" && bottomNumbers.innerHTML != 0 && block == false) {
        choosenSign = " + ";
    } else if (sign == "-" && bottomNumbers.innerHTML != 0 && block == false) {
        choosenSign = " - ";
    } else if (sign == "/" && bottomNumbers.innerHTML != 0 && block == false) {
        choosenSign = " / ";
    } else if (sign == "x" && bottomNumbers.innerHTML != 0 && block == false || sign == "X" && bottomNumbers.innerHTML != 0 && block == false || sign == "*" && bottomNumbers.innerHTML != 0 && block == false) {
        choosenSign = " * ";
    } else if (sign == "%" && bottomNumbers.innerHTML != 0 && block == false) {
        //dodaje % przy liczbie badź go odejmuje
        if (bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) != '%' && isthereProcent == false) {
            bottomNumbers.innerHTML = bottomNumbers.innerHTML + "%"
            isthereProcent = true;
            isThereComma = false;
        } else if (bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) == '%') {
            bottomNumbers.innerHTML = bottomNumbers.innerHTML.substring(0, bottomNumbers.innerHTML.length - 1)
            isthereProcent = false;
        }
    } else if (sign == "Enter" && bottomNumbers.innerHTML != "-" && topNumbers.innerHTML.length > 0 && block == false || isthereProcent == true && sign == "Enter" && bottomNumbers.innerHTML != "0" && bottomNumbers.innerHTML != "-" && block == false ||
        sign == "="  && bottomNumbers.innerHTML != "-" && topNumbers.innerHTML.length > 0 && block == false || isthereProcent == true && sign == "=" && bottomNumbers.innerHTML != "0" && bottomNumbers.innerHTML != "-" && block == false) {
        //obliczanie wyniku
        let result;
        if (isthereProcent == true && topNumbers.innerHTML == "") {
            //obliczanie samego procenta
            result = procent();
        } else if (isthereProcent == true) {
            //jesli jest procent to uzywam funkcji która sprawdza i oddaje odpowiednia liczbe
            result = eval(calculations.concat(procent()));
        } else if (isthereProcent == false && calculations.charAt(calculations.length-2) == '/' ||isthereProcent == false && calculations.charAt(calculations.length-2) == '*') {
            result = "Nie wolno przez 0"
            //jesli chcemy podzielic przez 0
        }else if(isthereProcent == false ){
            result = eval(calculations.concat(bottomNumbers.innerHTML));
        }
        topNumbers.innerHTML = topNumbers.innerHTML.concat(bottomNumbers.innerHTML + " = ") // dodaje = na koniec kodu w górnej linii
        bottomNumbers.innerHTML = result; //wyświetlam wynik
        block = true;
    } else if (sign == "+/-" && block == false) {
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
    } else if (sign == "c" || sign == "C" || sign == "Backspace") {
        //usuwa wszystko
        block = false;
        calculations = "";
        isthereProcent = false;
        isThereComma = false;
        tmpComma = false
        topNumbers.innerHTML = "";
        bottomNumbers.innerHTML = "0";
    }

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
    if (number == "," && isthereProcent == true && isThereComma == true && block == false && bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) == '.' && bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 2) == '0') {
        isThereComma = false;
        bottomNumbers.innerHTML = bottomNumbers.innerHTML.substring(0, bottomNumbers.innerHTML.length - 2)
        //zabiera przecinek ale tylko jeśli jest za znakiem %
    } else if (number == "," && isThereComma == false && block == false && bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) == '%') {
        isThereComma = true;
        tmpComma = true;
        bottomNumbers.innerHTML = bottomNumbers.innerHTML.concat("0.");
        //dodaje przecinek dokładnie to 0. po % 
    } else if (number == "," && isThereComma == false && block == false) {
        //dodaje przecinek
        isThereComma = true;
        tmpComma = true;
        bottomNumbers.innerHTML = bottomNumbers.innerHTML.concat(".");
    } else if (number != "," && bottomNumbers.innerHTML == "0" && block == false) {
        bottomNumbers.innerHTML = number.toString();
       //wpisywanie liczby jeśli na początku jest zero
    } else if (number != "," && bottomNumbers.innerHTML != "0" && block == false) {
        //wpisywanie liczb klawiatura/myszka
        bottomNumbers.innerHTML = bottomNumbers.innerHTML.concat(number.toString());
    } else if (number == "," && bottomNumbers.innerHTML == "0." && block == false && isThereComma == true) {
        bottomNumbers.innerHTML = "0";
        isThereComma = false;
        //zabiera przecinek gdy mamy zero na dolnej lini
    } else if (number == "," && bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) == '.' && bottomNumbers.innerHTML.length >= 2 && isThereComma == true) {
        isThereComma = false;
        bottomNumbers.innerHTML = bottomNumbers.innerHTML.substring(0, bottomNumbers.innerHTML.length - 1)
        //jeśli mamy kilka liczb i zabieramy przecinek
        
    }
}

function procent() {
    //obliczanie procentów
    if (bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) == '%' && isThereComma == true && isthereProcent == true) {
        return (parseFloat(bottomNumbers.innerHTML) / 100).toString();
        //zwykly procent z liczby
    } else if (bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) == '%' && isThereComma == false && isthereProcent == true) {
        return (parseInt(bottomNumbers.innerHTML) / 100).toString();
        //zwykly procent z liczby no ale ,
    } else if (bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) != '%' && tmpComma == true && isthereProcent == true) {
        //obliczanie procentu z liczby od razu
        let numb = (bottomNumbers.innerHTML).split("%");
        return (Math.round(((parseFloat(numb[0]) / 100) * parseFloat(numb[1])) * 10000) / 10000).toString();
    } else if (bottomNumbers.innerHTML.charAt(bottomNumbers.innerHTML.length - 1) != '%' && tmpComma == false && isthereProcent == true) {
        //obliczanie procentu z liczby od razu
        let numb = (bottomNumbers.innerHTML).split("%");
        return (Math.round(((parseInt(numb[0]) / 100) * parseInt(numb[1])) * 1000000) / 1000000).toString();
    }
}

function makeComma() {
    let commas = calculations.split(".");
    console.log(commas)
    let xd = "";
    for (let i = 0; i < commas.length; i++) {
        if (i == 0) {
            xd += commas[i]
        } else if (i == commas.length) {
            xd += commas[i]
        } else {
            xd += "." + commas[i]
        }
        // xd = comas[i] + '.'
    }
    console.log(xd);
    // console.log(eval(xd))
    calculations = xd;

}