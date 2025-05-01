function startSnake () {
    console.log("Snake game started")
}
// let calcMenu = new Menu(calcButtons, screen.width / 2, screen.height / 2);
// currentMenu = calcMenu
function showCalculator () {
    console.log("Calculator selected")
}
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

    constructor(x: number, y: number, label: string, outline: number = 6) {
        this.x = x;
        this.y = y;
        this.text = textsprite.create(label);
        this.text.setMaxFontHeight(8);
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
    y: number;
    selector: Image;
    oldWidth: number;
    oldHeight: number;


    constructor(actions: { [key: string]: () => void }, x: number, y: number) {
        this.selector = image.create(screen.width, screen.height)
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
        // if (this.oldHeight != this.labels[index].text.height || this.oldWidth != this.labels[index].text.width) {
        //     this.selector.fillRect(0, 0, screen.width, screen.height, 0)
        //     this.selector.fillRect(this.labels[index].text.x - this.labels[index].text.width / 2, this.labels[index].text.y - this.labels[index].text.height / 2, this.labels[index].text.width, this.labels[index].text.height, 1)
        //     scene.setBackgroundImage(this.selector)
        //     // this.oldHeight = this.labels[index].text.height
        //     // this.oldWidth = this.labels[index].text.width
        // }


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
let calcButtons: { [key: string]: () => void } = {
    "i": () => Flappy(),
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
};
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
