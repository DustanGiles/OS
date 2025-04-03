let a = 0
// Initialize the menu_items array correctly
let menuItems: string[] = ["Calculator", "Notes", "Games", "Settings"]

class Text {
    x: number;
    y: number;
    text: TextSprite;
    width: number;

    constructor(x: number, y: number, text: string, height: number = 1, border: number = 1, borderWidth: number = 0, z: number = 10) {
        // Coordinates and text parameters
        this.x = x;
        this.y = y;
        this.text = textsprite.create(text);

        // Set text height, outline, Z index, and position
        this.text.setMaxFontHeight(height);
        this.text.setOutline(borderWidth, border);
        this.text.setPosition(x, y);
        this.text.z = z;

        // Store the width of the text sprite
        this.width = this.text.width;
    }

    // Method to set text position
    public setTextPosition(x: number, y: number): void {
        this.text.setPosition(x, y);
    }

    // Getters for x and y
    public getX(): number {
        return this.text.x;
    }

    public getY(): number {
        return this.text.y;
    }
}

class Menu {
    menuItems: Text[];  // Declaring menuItems as an array of Text objects
    selector: number;
    posX: number;
    posY: number;
    menuLength: number;
    constructor(items: string[], posX: number, posY: number) {
        let cursor = [posX, posY]; // Start at the center of the screen
        this.menuLength = items.length;
        this.menuItems = []; // Initialize the menuItems array
        this.selector = 0;
        this.posX = posX;
        this.posY = posY;

        // Create a new Text object for each menu item and position them vertically
        for (let item of items) {
            this.menuItems.push(new Text(cursor[0], cursor[1], item, 1, 1, 0, 10));
            cursor[1] += 10; // Adjust the vertical position for the next item
        }

        
    }

    public moveMenu(posX: number, posY: number): void {
        let cursor = [posX, posY];
        for (let item = 0; item < this.menuItems.length; item++) {
            this.menuItems[item].setTextPosition(cursor[0], cursor[1]);
            cursor[1] += 10; // Adjust the vertical position for the next item
        }
    }

    public select(n: number): void { 
        let cursor = [this.menuItems[n].x, this.posY + (this.posY - this.menuItems[n].y)];
        for (let item = 0; item < this.menuItems.length; item++) {
            this.menuItems[item].setTextPosition(cursor[0], cursor[1]);
            cursor[1] += 10; // Adjust the vertical position for the next item
        }
    }

    // Method to return the menu items
    public returnMenu(): Text[] {
        return this.menuItems;
    }
}

// Example usage:
let pic = image.create(scene.screenWidth(), scene.screenHeight())
// Fill the background
pic.fillRect(0, 0, scene.screenWidth(), scene.screenHeight(), 0)
scene.setBackgroundImage(pic)
// for (let i = 0; i <= 20; i++) {
//     // Using a 1-based index for better display
//     menuItems.push(`${i}`)
// }
let menu = new Menu(menuItems, screen.width/2, screen.height/2);

let n = 0
let count = 0
forever(function() {
    if (controller.up.isPressed()) {
        n++;
        pause(100)
    }
    if (controller.down.isPressed()) {
        n--;
        pause(100)
    }
    if (n > menu.menuLength-1){
        n--;
    }
    if (n < 0) {
        n++;
    }

    menu.select(n);
    console.log(n);
})

