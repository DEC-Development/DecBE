scoreboard players set @s skill_count 0
tag @s add thunder_rapier_skill
scriptevent dec:sustain_damage lightning;15;5;4
scriptevent dec:sustain_particle dec:thunder_wake_particle;20;1
scriptevent dec:sprint 3
execute if entity @s[tag=thunder_rapier_skill] run playanimation @s animation.humanoid.sprint
tag @s remove thunder_rapier_skill