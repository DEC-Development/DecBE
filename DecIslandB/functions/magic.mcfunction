##魔法值显示
execute if score MagicDisplay global = one global run scoreboard objectives add tens dummy
execute if score MagicDisplay global = one global run scoreboard players remove @a[scores={tens=1..}] tens 1
execute if score MagicDisplay global = one global as @a[scores={tens=..1}] run scoreboard objectives remove magicdisplay
execute if score MagicDisplay global = one global run scoreboard players set @a[scores={tens=..1}] tens 20
execute if score MagicDisplay global = one global run scoreboard objectives add magicdisplay dummy §bMagicPoint§r
execute if score MagicDisplay global = one global as @a at @s run scoreboard players operation @s magicdisplay = @s magicpoint
execute if score MagicDisplay global = one global run scoreboard objectives setdisplay sidebar magicdisplay