import pygame

# Initialize Pygame
pygame.init()

# Set up the display
WINDOW_WIDTH = 600
WINDOW_HEIGHT = 600
screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
pygame.display.set_caption("RPG Game")

# Colors
GREEN = (0, 127, 0)  # RGB value for green

# Load and prepare sprite sheet
sprite_sheet = pygame.image.load("Girl-Sprite-0003.png").convert_alpha()
total_image_width = 1280
total_image_height = 1280
sprite_width = total_image_width // 4  # 320px
sprite_height = total_image_height // 4  # 320px
scale = 0.25
scaled_width = int(sprite_width * scale)  # 80px
scaled_height = int(sprite_height * scale)  # 80px

# Player class
class Player:
    def __init__(self):
        self.x = WINDOW_WIDTH // 2 - scaled_width // 2
        self.y = WINDOW_HEIGHT // 2 - scaled_height // 2
        self.speed = 3
        self.frame_x = 0
        self.frame_y = 1  # Start with idle
        self.max_frame = 4
        self.frame_timer = 0
        self.frame_interval = 10
        self.idle_frame_interval = 30
        self.moving = False
        self.direction = "idle"

# Animation states
animations = {
    "walkDown": 0,  # 00 01 02 03
    "idle": 1,      # 10 11 12 13
    "walkUp": 2,    # 20 21 22 23
    "walkLeft": 3,  # 30 31 32 33
    "walkRight": 3, # Same as left, but flipped
}

# Create player instance
player = Player()

# Game loop
running = True
clock = pygame.time.Clock()

def update_player():
    player.moving = False
    keys = pygame.key.get_pressed()
    
    # Movement and direction
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

    # Set animation row
    player.frame_y = animations[player.direction]

    # Animate frames
    player.frame_timer += 1
    current_interval = player.frame_interval if player.moving else player.idle_frame_interval
    if player.frame_timer >= current_interval:
        player.frame_x = (player.frame_x + 1) % player.max_frame
        player.frame_timer = 0

def draw_player():
    screen.fill(GREEN)  # Clear screen with green background
    
    # Get current sprite frame
    sprite = pygame.Surface((sprite_width, sprite_height), pygame.SRCALPHA)
    sprite.blit(sprite_sheet, (0, 0), 
                (player.frame_x * sprite_width, player.frame_y * sprite_height, 
                 sprite_width, sprite_height))
    
    # Scale the sprite
    scaled_sprite = pygame.transform.scale(sprite, (scaled_width, scaled_height))
    
    # Flip for right movement
    if player.direction == "walkLeft":
        scaled_sprite = pygame.transform.flip(scaled_sprite, True, False)
    
    # Draw the sprite
    screen.blit(scaled_sprite, (player.x, player.y))

# Main game loop
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    
    update_player()
    draw_player()
    pygame.display.flip()
    clock.tick(60)  # 60 FPS

pygame.quit()