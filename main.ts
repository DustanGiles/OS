function startSnake () {
    console.log("Snake game started")
}
// let calcMenu = new Menu(calcButtons, screen.width / 2, screen.height / 2);
// currentMenu = calcMenu
function showCalculator() {
    console.log("Calculator selected");
    currentMenu.destroy();

    let pressedList: string[] = [];
    let pressedText = "";
    let buttonSize = 20;
    let margin = 15;
    let buttonsPerLine = (screen.width) / buttonSize;
    let buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "x", "/", "=", "AC"];
    let buttonsText: Text[] = [];
    let pos = [buttonSize / 2, 80];

    // Create button grid
    for (let button of buttons) {
        if (pos[0] > screen.width - buttonSize / 2) {
            pos[0] = buttonSize / 2;
            pos[1] += buttonSize;
        }
        buttonsText.push(new Text(pos[0], pos[1], button, 0));
        pos[0] += buttonSize;
    }

    // Create selector sprite
    let selector = image.create(20, 20);
    selector.fillRect(0, 0, 20, 20, 2);
    let mySprite = sprites.create(selector, SpriteKind.Player);
    let selected = 0;
    mySprite.setPosition(buttonsText[selected].x, buttonsText[selected].y);
    pause(500);

    // Display area for pressed text
    let displayPressed = new Text(10, 20, "", 0, 12);
    let displayed = "";

    while (true) {
        if (controller.A.isPressed()) {
            let currentButton = buttons[selected];

            if (currentButton === "AC") {
                // Clear screen and reset
                pressedList = [];
                displayed = "";
                displayPressed.text.setText(displayed);
            } else if (currentButton === "=") {
                // Calculate and display result
                displayed = calculate(pressedList).toString();
                displayPressed.text.setText(displayed);
            } else {
                // Add button to pressed list
                pressedList.push(currentButton);

                // Update displayed text accordingly
                if (currentButton === "+" || currentButton === "-" || currentButton === "x" || currentButton === "/") {
                    // If an operator is pressed, show the current expression
                    displayed = pressedList.join("");
                } else {
                    // If a number is pressed, just show it
                    displayed = pressedList.join("");
                }
                displayPressed.text.setText(displayed);
            }

            pause(100);  // Debounce the button press
        }

        // Navigation logic: Arrow keys
        if (controller.right.isPressed()) {
            selected += 1;
        }
        if (controller.left.isPressed()) {
            selected -= 1;
        }
        if (controller.up.isPressed()) {
            if (selected - buttonsPerLine >= 0) {
                selected -= buttonsPerLine;
            }
        }
        if (controller.down.isPressed()) {
            if (selected + buttonsPerLine < buttonsText.length) {
                selected += buttonsPerLine;
            }
        }

        // Clamp the selected index to valid range
        if (selected >= buttonsText.length) {
            selected = buttonsText.length - 1;
        }
        if (selected < 0) {
            selected = 0;
        }

        // Update sprite position to follow the selection
        mySprite.setPosition(buttonsText[selected].x, buttonsText[selected].y);

        // Optionally log the value to debug
        console.logValue(displayed, "list");

        pause(60);
    }
}



function calculate(inputList: string[]): Number {
    let numberStr = "";
    let operation = "";
    let grouped: string[] = [];

    // Parse input into numbers and operators
    for (let input of inputList) {
        if (!isNaN(parseFloat(input))) {
            numberStr += input;
        } else {
            grouped.push(numberStr); // Push the number before the operator
            numberStr = "";
            grouped.push(input); // Push the operator
        }
    }

    if (numberStr.length > 0) {
        grouped.push(numberStr); // Push the last number if present
    }

    let output = parseFloat(grouped[0]); // Initialize output with the first number
    let index = 1; // Start from the second element

    // Iterate through the grouped list and evaluate the expression
    while (index < grouped.length) {
        let operator = grouped[index];
        let nextNum = parseFloat(grouped[index + 1]);

        if (operator === "+") {
            output += nextNum; // Perform addition
        }
        if (operator === "-") {
            output -= nextNum; // Perform addition
        }
        if (operator === "/") {
            output /= nextNum; // Perform addition
        }
        if (operator === "x") {
            output *= nextNum; // Perform addition
        }

        index += 2; // Skip over the operator and the next number
    }

    return output;
}

// console.log(calculate(["1", "4", "+", "6", "/", "2"])); // Output should be 47


function Flappy () {
    console.log("Flappy game started")
    currentMenu.destroy();
bird = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . 5 5 5 5 5 5 5 . . . . . . 
        . . 5 5 5 5 5 5 5 5 5 . . . . . 
        . 5 5 5 5 5 5 5 5 5 5 5 . . . . 
        5 5 5 4 4 5 5 5 5 5 5 5 5 . . . 
        5 5 4 4 4 4 4 5 5 f 5 5 5 . . . 
        5 4 4 4 4 4 4 4 5 5 5 5 5 4 . . 
        5 4 4 4 4 4 4 4 5 5 5 5 5 4 4 . 
        4 4 4 4 4 4 4 5 5 5 5 5 5 4 4 4 
        4 4 4 4 4 4 5 5 5 5 5 5 5 . . . 
        4 4 4 4 4 4 5 f 5 5 5 5 5 . . . 
        . 4 4 4 4 5 5 f f 5 5 5 . . . . 
        . 4 4 4 5 5 5 5 f f f . . . . . 
        . . . 5 5 5 5 5 5 5 . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Player)
}
function selectOutlineColor (colour: number) {
    settings.writeNumber("outlineColour", colour)
}
let bird: Sprite = null
let debounceThing = false
class Text {
    x: number;
    y: number;
    text: TextSprite;

    constructor(x: number, y: number, label: string, outline: number = 6, height: number = 8) {
        this.x = x;
        this.y = y;
        this.text = textsprite.create(label);
        this.text.setMaxFontHeight(height);
        this.text.setOutline(1, outline);
        this.text.setPosition(x, y);
        this.text.z = 10;
    }

    setPosition(x: number, y: number): void {
        this.text.setPosition(x, y);
    }

    destroy(): void {
        sprites.destroy(this.text);
    }
}
class Menu {
    items: string[];
    labels: Text[];
    actions: { [key: string]: () => void };
    selectedIndex: number;
    x: number;
    y: number
    oldWidth: number;
    oldHeight: number;


    constructor(actions: { [key: string]: () => void }, x: number, y: number) {
        this.items = Object.keys(actions);
        this.actions = actions;
        this.labels = [];
        this.selectedIndex = 0;
        this.x = x;
        this.y = y;
        this.oldHeight = 0;
        this.oldWidth = 0;

        let offsetY = y;
        for (let label of this.items) {
            this.labels.push(new Text(x, offsetY, label, settings.readNumber("outlineColour")));
            offsetY += 10;
        }
    }

    updateSelection(index: number): void {
        let offsetY2 = this.y + (this.y - this.labels[index].y);


        for (let label2 of this.labels) {
            label2.setPosition(this.x, offsetY2);
            offsetY2 += 10;
        }

    }

    getSelectedItem(): string {
        return this.items[this.selectedIndex];
    }

    get length(): number {
        return this.items.length;
    }

    selectNext(): void {
        this.selectedIndex = Math.min(this.length - 1, this.selectedIndex + 1);
    }

    selectPrev(): void {
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
    }

    activate(): void {
        let selected = this.getSelectedItem();
        this.actions[selected]();
        pause(500)
        debounceThing = false;
    }

    destroy(): void {
        for (let label3 of this.labels) {
            label3.destroy();
        }
    }

    handleInput(): void {
        if (controller.up.isPressed()) {
            this.selectPrev();
            //music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.InBackground)
            pause(80);
        }

        if (controller.down.isPressed()) {
            this.selectNext();
            //music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.InBackground)
            pause(80);
        }

        if (controller.A.isPressed() && debounceThing == false) {
            debounceThing = true
            //music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
            this.activate();
        }

        this.updateSelection(this.selectedIndex);
    }
}
if (!(settings.exists("outlineColour"))) {
    settings.writeNumber("outlineColour", 6)
}
if (!(settings.exists("textSize"))) {
    settings.writeNumber("textSize", 9)
}
let mainMenuItems: { [key: string]: () => void } = {
    "Calculator": showCalculator,
    "Games": () => openMenu(new Menu(gamesMenuItems, screen.width / 2, screen.height / 2)),
    "Settings": () => openMenu(new Menu(settingsMenuItems, screen.width / 2, screen.height / 2)),
};
let gamesMenuItems: { [key: string]: () => void } = {
    "Snake": startSnake,
    "Flappy": Flappy,
    "Back": () => openMenu(new Menu(mainMenuItems, screen.width / 2, screen.height / 2)),
};
let settingsMenuItems: { [key: string]: () => void } = {
    "Text Outline Colour": () => openMenu(new Menu(textOutlineColorMenuItems, screen.width / 2, screen.height / 2)),
    // "Audio Volume": () => openMenu(new Menu(audioVolumeMenuItems, screen.width / 2, screen.height / 2)),
    "Back": () => openMenu(new Menu(mainMenuItems, screen.width / 2, screen.height / 2)),
};
let textOutlineColorMenuItems: { [key: string]: () => void } = {
    "Red": () => selectOutlineColor(2),
    "Pink": () => selectOutlineColor(3),
    "Orange": () => selectOutlineColor(4),
    "Yellow": () => selectOutlineColor(5),
    "Cyan": () => selectOutlineColor(6),
    "Green": () => selectOutlineColor(7),
    "Dark Blue": () => selectOutlineColor(8),
    "Light Blue": () => selectOutlineColor(9),
    "Purple": () => selectOutlineColor(10),
    "None": () => selectOutlineColor(15),
    "Back": () => openMenu(new Menu(settingsMenuItems, screen.width / 2, screen.height / 2)),
};
// let calcButtons: { [key: string]: () => void } = {
    // "i": () => Flappy(),
    // "2": () => selectOutlineColor(3),
    // "3": () => selectOutlineColor(4),
    // "4": () => selectOutlineColor(5),
    // "5": () => selectOutlineColor(6),
    // "6": () => selectOutlineColor(7),
    // "7": () => selectOutlineColor(8),
    // "8": () => selectOutlineColor(9),
    // "9": () => selectOutlineColor(10),
    // "0": () => selectOutlineColor(15),
    // "+": () => openMenu(new Menu(settingsMenuItems, screen.width / 2, screen.height / 2)),
    // "-": () => openMenu(new Menu(settingsMenuItems, screen.width / 2, screen.height / 2)),
    // "x": () => openMenu(new Menu(settingsMenuItems, screen.width / 2, screen.height / 2)),
    // "/": () => openMenu(new Menu(settingsMenuItems, screen.width / 2, screen.height / 2)),
    // "=": () => openMenu(new Menu(settingsMenuItems, screen.width / 2, screen.height / 2)),
    // "CLEAR ALL": () => openMenu(new Menu(settingsMenuItems, screen.width / 2, screen.height / 2)),
// };
let currentMenu: Menu;
let mainMenu = new Menu(mainMenuItems, screen.width / 2, screen.height / 2);
let gamesMenu: Menu;
currentMenu = mainMenu
function openMenu(menu: Menu): void {

    currentMenu.destroy();
    currentMenu = menu;
    menu.updateSelection(menu.selectedIndex);

}
forever(function () {
    currentMenu.handleInput();
})
