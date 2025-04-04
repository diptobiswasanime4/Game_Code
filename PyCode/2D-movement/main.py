import pygame

pygame.init()

WINDOW_WIDTH = 600
WINDOW_HEIGHT = 600

screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
pygame.display.set_caption("RPG Player")

running = True
clock = pygame.time.Clock()

GREEN = (0, 127, 0)

sprite_sheet = pygame.image.load("Girl-Sprite-0003.png").convert_alpha()
total_image_width = 1280
total_image_height = 1280
sprite_width = 320
sprite_height = 320
scale = 0.5
scaled_width = int(sprite_width * scale)
scaled_height = int(sprite_height * scale)

animations = {
    "walkDown": 0,
    "idle": 1,
    "walkUp": 2,
    "walkLeft": 3,
    "walkRight": 3
}

class Player:
    def __init__(self):
        self.x = WINDOW_WIDTH // 2 - scaled_width // 2
        self.y = WINDOW_HEIGHT // 2 - scaled_height // 2
        self.speed = 5
        self.frame_x = 0
        self.frame_y = 1
        self.max_frame = 4
        self.frame_timer = 0
        self.frame_interval = 10
        self.idle_frame_interval = 30
        self.moving = False
        self.direction = "idle"

player = Player()

def update_player():
    player.moving = False
    keys = pygame.key.get_pressed()

    if keys[pygame.K_w] and player.y > 0:
        player.y -= player.speed
        player.direction = "walkUp"
        player.moving = True
    elif keys[pygame.K_s] and player.y < WINDOW_HEIGHT - scaled_height:
        player.y += player.speed
        player.direction = "walkDown"
        player.moving = True
    elif keys[pygame.K_a] and player.x > 0:
        player.x -= player.speed
        player.direction = "walkLeft"
        player.moving = True
    elif keys[pygame.K_d] and player.x < WINDOW_WIDTH - scaled_width:
        player.x += player.speed
        player.direction = "walkRight"
        player.moving = True
    else:
        player.direction = "idle"
        player.moving = False

    player.frame_y = animations[player.direction]

    player.frame_timer += 1
    current_interval = player.frame_interval if player.moving else player.idle_frame_interval
    if player.frame_timer >= current_interval:
        player.frame_x = (player.frame_x + 1) % player.max_frame
        player.frame_timer = 0

def draw_player():
    screen.fill(GREEN)

    sprite = pygame.Surface((sprite_width, sprite_height), pygame.SRCALPHA)
    sprite.blit(
         sprite_sheet, (0, 0),
         (player.frame_x * sprite_width, player.frame_y * sprite_height, sprite_width, sprite_height)
     )

    scaled_sprite = pygame.transform.scale(sprite, (scaled_width, scaled_height))

    if player.direction == "walkLeft":
         scaled_sprite = pygame.transform.flip(scaled_sprite, True, False)

    screen.blit(scaled_sprite, (player.x, player.y))

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    update_player()
    draw_player()
    pygame.display.flip()
    clock.tick(60)

pygame.quit()