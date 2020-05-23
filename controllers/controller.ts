"use strict";
let car: Car;


function createCar() {
    // Select form elements
    let plate: HTMLInputElement = <HTMLInputElement>document.getElementById("plate");
    let color: HTMLInputElement = <HTMLInputElement>document.getElementById("color");
    let brand: HTMLInputElement = <HTMLInputElement>document.getElementById("brand");

    // Remove invalids to ensure form validation works multiple times
    let formElements: Array<HTMLInputElement> = [plate, color, brand];
    formElements.filter(e => e.value).forEach(removeInvalid);

    // Select divs
    let container: HTMLElement = <HTMLElement>document.getElementById("container");
    let formcontainer: HTMLAreaElement = <HTMLAreaElement>document.getElementById("formcontainer");
    let tablecontainer: HTMLAreaElement = <HTMLAreaElement>document.getElementById("tablecontainer");
    let cartable: HTMLTableElement = <HTMLTableElement>document.getElementById("carTable");


    if (validateCar(plate, brand, color)) {
        // Remove first form and display second form
        container.style.display = "none";
        formcontainer.style.display = "block";

        // Create car
        car = new Car(plate.value, color.value, brand.value);
        let elements: [{ plate: string, color: string, brand: string }] = [getCar(car)];

        // Display car in a table
        let header: HTMLElement = document.createElement("P")
        let text: CharacterData = document.createTextNode("Car");
        header.appendChild(text);
        tablecontainer.appendChild(header);

        let keys: string[] = Object.keys(elements[0]);

        generateTableHead(cartable, keys);
        generateTable(cartable, elements);
    }

}

function addwheel() {
    // Select divs
    let wheelstable: HTMLTableElement = <HTMLTableElement>document.getElementById("wheelsTable");
    let wtablecontainer: HTMLAreaElement = <HTMLAreaElement>document.getElementById("wtablecontainer");

    // Select form elements
    let brands: Array<HTMLInputElement> = [1, 2, 3, 4].map(id => {
        return <HTMLInputElement>document.getElementById(`${id}wheelb`);
    });

    let diameters: Array<HTMLInputElement> = [1, 2, 3, 4].map(id => {
        return <HTMLInputElement>document.getElementById(`${id}wheeld`);
    });

    // Remove invalids to ensure form validation works multiple times
    brands.filter(e => e.value).forEach(removeInvalid);
    diameters.filter(e => e.value).forEach(removeInvalid);

    // Validate wheels
    let errors: Array<boolean> = [1, 2, 3, 4].map(id => validateWheel(brands[id - 1], diameters[id - 1], id));

    if (!errors.includes(false)) {
        // Select divs, remove old form and display only tables
        let wheelForm: HTMLElement = <HTMLElement>document.getElementById("wheelForm");
        let wheelButton: HTMLElement = <HTMLElement>document.getElementById("wheelButton");

        wheelForm.style.display = "none";
        wheelButton.style.display = "none";

        // Add whels in car
        car.addWheel(new Wheel(Number(diameters[0].value), brands[0].value));
        car.addWheel(new Wheel(Number(diameters[1].value), brands[1].value));
        car.addWheel(new Wheel(Number(diameters[2].value), brands[2].value));
        car.addWheel(new Wheel(Number(diameters[3].value), brands[3].value));
    
        // Create table and display wheels
        let header: HTMLElement = document.createElement("P");
        let text: CharacterData = document.createTextNode("Wheels");
        header.appendChild(text);
        wtablecontainer.appendChild(header);
    
        let keys: string[] = Object.keys(car.wheels[0]);
    
        generateTableHead(wheelstable, keys);
        generateTable(wheelstable, car.wheels);  
    }    
}

function getCar(car: Car) {
    return { plate: car.plate, color: car.color, brand: car.brand };
}

function generateTableHead(table: HTMLTableElement, data: string[]) {
    let thead: HTMLTableSectionElement = table.createTHead();
    let row: HTMLTableRowElement = thead.insertRow();
    for (let key of data) {
        let th: HTMLTableHeaderCellElement = document.createElement("th");
        let text: Text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}


function generateTable(table: HTMLTableElement, data: any) {
    for (let element of data) {
        let row: HTMLTableRowElement = table.insertRow();
        for (let key in element) {
            let cell: HTMLTableDataCellElement = row.insertCell();
            let text: Text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}


function validateCar(plate: HTMLInputElement, brand: HTMLInputElement, color: HTMLInputElement) {
    let error_count: number = 0;

    let plateError: HTMLElement = <HTMLElement>document.getElementById("plateError");
    let colorError: HTMLElement = <HTMLElement>document.getElementById("colorError");
    let brandError: HTMLElement = <HTMLElement>document.getElementById("brandError");


    if (plate.value == "") {
        plate.classList.add("is-invalid");
        plateError.textContent = "Plate is required";
        error_count++;
    } else if (!validatePlate(plate.value)){
        plate.classList.add("is-invalid");
        plateError.textContent = "Plate format: four numbers +  three letters";
        error_count++;
    }

    if (brand.value == "") {
        brand.classList.add("is-invalid");
        brandError.textContent = "Brand is required";
        error_count++;
    }

    if (color.value == "") {
        color.classList.add("is-invalid");
        colorError.textContent = "Color is required";
        error_count++;
    }

    if (error_count > 0) {
        return false;
    } else {
        return true;
    }
}

function validateWheel(brand: HTMLInputElement, diameter: HTMLInputElement, id: Number) {
    let error_count: number = 0;

    let wheelsErrorB: HTMLElement = <HTMLElement>document.getElementById(`wheelErrorB${id}`);
    let wheelsErrorD: HTMLElement = <HTMLElement>document.getElementById(`wheelErrorD${id}`);

    if (brand.value == "") {
        brand.classList.add("is-invalid");
        wheelsErrorB.textContent = "Brand is required";
        error_count++;
    }

    if (diameter.value == "") {
        diameter.classList.add("is-invalid");
        wheelsErrorD.textContent = "Diameter is required";
        error_count++;
    } else if (!diameter.value.match(/^-?[0-9]\d*(\.\d+)?$/)) {
        diameter.classList.add("is-invalid");
        wheelsErrorD.textContent = "Diameter must be a number";
        error_count++;
    } else if(Number(diameter.value) < -0.4 || Number(diameter.value) > 2){
        diameter.classList.add("is-invalid");
        wheelsErrorD.textContent = "Diameter must be between -0.4 and 2";
        error_count++; 
    }

    if (error_count > 0) {
        return false;
    } else {
        return true;
    }


}

function removeInvalid(element: HTMLInputElement) {
    if (element.value != element.defaultValue) {
        console.log("Change detected");
        element.defaultValue = element.value;
        element.classList.remove('is-invalid');
    }    
}

function validatePlate(plate: string){
    let regex = /^\d{4}[a-zA-Z]{3}$/;
    return regex.test(plate) ? true : false;
}

