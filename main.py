class Text:
    def __init__(self, x: int, y: int, text: str, height: int = 1, border: int = 1, border_width: int = 0):
        # Coordinates and text parameters
        self.x = x
        self.y = y
        self.text = textsprite.create(text)  # Assuming textsprite.create() returns a text sprite object
        
        # Setting text height, outline, and position
        self.text.set_max_font_height(height)
        self.text.set_outline(border_width, border)
        self.text.set_position(x, y)
        
        # Storing width of the text sprite
        self.width = self.text.width


    def setTextPosition(self, x, y):
        self.text.set_position(x, y)

    def getX(self):
        return self.text.x

    def getY(self):
        return self.text.y

class Menu:
    def __init__(self, items):
        cursor = [scene.screen_width()/2, 10]
        self.menu_items = []
        for item in items:
            self.menu_items.append(Text(cursor[0], cursor[1], item))
            cursor[1] += 10
    
    def returnMenu(self):
        return menu_items

pic = image.create(scene.screen_width(), scene.screen_height())
pic.fill_rect(0, 0, scene.screen_width(), scene.screen_height(), 16)
scene.set_background_image(pic)

menu_items = []
for i in range(10):
    menu_items.append("Option " + str(i))

menu = Menu(menu_items)

menu.menu_items[1]


# selector = image.create(menu.menu_items[1].text.width(), menu.menu_items[1].text.height())

# hi = Text(scene.screen_width()/2, 10, "Hi")
# bye = Text(scene.screen_width()/2, scene.screen_height()/2, "Bye")
