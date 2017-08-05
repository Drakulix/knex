from PIL import Image, ImageDraw
from hashlib import md5


GRID_SIZE = 7
BORDER_SIZE = 8
SQUARE_SIZE = 8


class Identicon(object):
    def __init__(self, str_, background='#ffffff'):
        """
        str_ is the string used to generate the identicon
        background is the background of the identicon
        """
        w = h = BORDER_SIZE * 2 + SQUARE_SIZE * GRID_SIZE
        self.image = Image.new('RGB', (w, h), background)
        self.draw = ImageDraw.Draw(self.image)
        self.hash = self.digest(str_.encode('utf-8'))
        self.name = str_

    def digest(self, str_):
        """
        returns a md5 numeric hash
        """
        return int(md5(str_).hexdigest(), 16)

    def calculate(self):
        """
        create the identicon
        first three bytes are used to generate the color
        remaining bytes are used to create the drawing
        """
        color = (self.hash & 0xff, self.hash >> 8 & 0xff, self.hash >> 16 & 0xff)
        self.hash >>= 24
        square_x = square_y = 0
        for x in range(int(GRID_SIZE * (GRID_SIZE + 1) / 2)):
            if self.hash & 1:
                x = BORDER_SIZE + square_x * SQUARE_SIZE
                y = BORDER_SIZE + square_y * SQUARE_SIZE
                self.draw.rectangle(
                    (x, y, x + SQUARE_SIZE, y + SQUARE_SIZE),
                    fill=color,
                    outline=color
                )
                x = BORDER_SIZE + (GRID_SIZE - 1 - square_x) * SQUARE_SIZE
                self.draw.rectangle(
                    (x, y, x + SQUARE_SIZE, y + SQUARE_SIZE),
                    fill=color,
                    outline=color
                )
            self.hash >>= 1
            square_y += 1
            if square_y == GRID_SIZE:
                square_y = 0
                square_x += 1

    def generate(self):
        """
        save and show calculated identicon
        """
        self.calculate()
        with open('identicon' + self.name + '.png', 'wb') as out:
            self.image.save(out, 'PNG')
