##魔法值显示
scoreboard objectives add tens dummy
scoreboard players remove @a[scores={tens=1..}] tens 1
execute @a[scores={tens=..1}] ~~~ scoreboard objectives remove magicdisplay
scoreboard players set @a[scores={tens=..1}] tens 20
scoreboard objectives add magicdisplay dummy §bMagicPoint§r
execute @a ~~~ scoreboard players operation @s magicdisplay = @s magicpoint
execute @a[tag=display_on] ~~~ scoreboard objectives setdisplay sidebar magicdisplay

##声明及重置变量
scoreboard objectives add magicreckontimer dummy
scoreboard objectives add magicpointmirror dummy
scoreboard objectives add gametime dummy
scoreboard objectives add magicpoint dummy
scoreboard objectives add maxmagic dummy
scoreboard objectives add magicgain dummy
scoreboard objectives add story_random dummy
scoreboard objectives add magicreckon dummy
scoreboard players set @a[tag=!mok] magicpoint 20
scoreboard players set @a[tag=!mok] maxmagic 0
scoreboard players set @a[tag=!mok] magicgain 1
scoreboard players set @a[tag=!mok] tens 20
scoreboard players set @a[tag=!mok] magicreckontimer 0
scoreboard players set @a[tag=!mok] magicreckon 0
tag @a[tag=!mok] add hpl1
tag @a[tag=!mok] add mok

##消耗魔法重置魔法计时
execute @a[scores={magicreckontimer=0}] ~~~ scoreboard players operation @s magicpointmirror = @s magicpoint
scoreboard players add @a[scores={magicreckontimer=..1}] magicreckontimer 1
execute @a[scores={magicreckontimer=2}] ~~~ scoreboard players operation @s magicpointmirror -= @s magicpoint
execute @a[scores={magicpointmirror=1..,magicreckontimer=2}] ~~~ scoreboard players set @s magicreckon 0
execute @a[scores={magicpointmirror=1..,magicreckontimer=2}] ~~~ particle dec:magic_decrease_particle ~~~
scoreboard players set @a[scores={magicreckontimer=2}] magicreckontimer 0

##魔法计时增加
scoreboard players add @a[scores={magicreckon=..129}] magicreckon 1