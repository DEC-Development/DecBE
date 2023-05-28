##魔法值显示
execute if score MagicDisplay global = one global run scoreboard objectives add tens dummy
execute if score MagicDisplay global = one global run scoreboard players remove @a[scores={tens=1..}] tens 1
execute if score MagicDisplay global = one global as @a[scores={tens=..1}] run scoreboard objectives remove magicdisplay
execute if score MagicDisplay global = one global run scoreboard players set @a[scores={tens=..1}] tens 20
execute if score MagicDisplay global = one global run scoreboard objectives add magicdisplay dummy §bMagicPoint§r
execute if score MagicDisplay global = one global as @a at @s run scoreboard players operation @s magicdisplay = @s magicpoint
execute if score MagicDisplay global = one global run scoreboard objectives setdisplay sidebar magicdisplay

##消耗魔法重置魔法计时
execute as @a[scores={magicreckontimer=0}] at @s run scoreboard players operation @s magicpointmirror = @s magicpoint
scoreboard players add @a[scores={magicreckontimer=..1}] magicreckontimer 1
execute as @a[scores={magicreckontimer=2}] at @s run scoreboard players operation @s magicpointmirror -= @s magicpoint
execute as @a[scores={magicpointmirror=1..,magicreckontimer=2}] at @s run scoreboard players set @s magicreckon 0
execute as @a[scores={magicpointmirror=1..,magicreckontimer=2}] at @s run particle dec:magic_decrease_particle ~~~
scoreboard players set @a[scores={magicreckontimer=2}] magicreckontimer 0

##魔法计时增加
scoreboard players add @a[scores={magicreckon=..129}] magicreckon 1