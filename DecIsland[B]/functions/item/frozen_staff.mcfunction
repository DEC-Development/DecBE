tag @s[scores={magicpoint=1..}] add shot
execute if entity @s[scores={magicpoint=1..}] run playsound dig.snow @a ~~~
scoreboard players remove @s[scores={magicpoint=1..}] magicpoint 1