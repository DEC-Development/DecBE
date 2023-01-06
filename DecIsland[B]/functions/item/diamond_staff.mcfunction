tag @s[scores={magicpoint=3..}] add shot
execute if entity @s[scores={magicpoint=3..}] run playsound item.book.put @a ~~~
scoreboard players remove @s[scores={magicpoint=3..}] magicpoint 3