class Text {
    x: number;
    y: number;
    text: TextSprite;

    constructor(x: number, y: number, label: string, outline: number=6) {
        this.x = x;
        this.y = y;
        this.text = textsprite.create(label);
        this.text.setMaxFontHeight(9);
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
    outline: number=6;

    constructor(actions: { [key: string]: () => void }, x: number, y: number) {
        this.items = Object.keys(actions);
        this.actions = actions;
        this.labels = [];
        this.selectedIndex = 0;
        this.x = x;
        this.y = y;

        let offsetY = y;
        for (let label of this.items) {
            this.labels.push(new Text(x, offsetY, label, this.outline));
            offsetY += 10;
        }
    }

    updateSelection(index: number): void {
        let offsetY = this.y + (this.y - this.labels[index].y);
        for (let label of this.labels) {
            label.setPosition(this.x, offsetY);
            offsetY += 10;
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
    }

    destroy(): void {
        for (let label of this.labels) {
            label.destroy();
        }
    }

    handleInput(): void {
        if (controller.up.isPressed()) {
            this.selectPrev();
            pause(100);
        }

        if (controller.down.isPressed()) {
            this.selectNext();
            pause(100);
        }

        if (controller.A.isPressed()) {
            this.activate();
            pause(500)
        }

        this.updateSelection(this.selectedIndex);
    }
}

let mainMenuItems: { [key: string]: () => void } = {
    "Calculator": showCalculator,
    "Settings": () => openMenu(new Menu(settingsMenuItems, screen.width / 2, screen.height / 2)),
    "Games": () => openMenu(new Menu(gamesMenuItems, screen.width / 2, screen.height / 2)),
};

let gamesMenuItems: { [key: string]: () => void } = {
    "Snake": startSnake,
    "Flappy": startFlappy,
    "Back": () => openMenu(new Menu(mainMenuItems, screen.width / 2, screen.height / 2)),
};

let settingsMenuItems: { [key: string]: () => void } = {
    "Text Outline Colour": () => openMenu(new Menu(textOutlineColorMenuItems, screen.width / 2, screen.height / 2)),
    "Flappy": startFlappy,
    "Back": () => openMenu(new Menu(mainMenuItems, screen.width / 2, screen.height / 2)),
};

let textOutlineColorMenuItems: { [key: string]: () => void } = {
    "Red": selectOutlineColor,
    "Green": startFlappy,
    "Back": () => openMenu(new Menu(mainMenuItems, screen.width / 2, screen.height / 2)),
};

function selectOutlineColor(): void {
    let outlineColor = 4
    currentMenu.outline = 4
}

function showCalculator(): void {
    console.log("Calculator selected");
}

function startSnake(): void {
    console.log("Snake game started");
}

function startFlappy(): void {
    console.log("Flappy game started");
}

// Global variables to manage active menu
let currentMenu: Menu;
let mainMenu = new Menu(mainMenuItems, screen.width / 2, screen.height / 2);
let gamesMenu: Menu;

currentMenu = mainMenu;

function openMenu(menu: Menu): void {
    
    currentMenu.destroy();
    currentMenu = menu;
}

forever(function () {
    currentMenu.handleInput();
});
