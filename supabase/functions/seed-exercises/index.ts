import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 200+ common exercises organized by body part
const exercises = [
  // CHEST (20 exercises)
  { name: "Barbell Bench Press", body_part: "chest", category: "strength", equipment: ["barbell", "bench"], description: "Classic compound chest exercise" },
  { name: "Incline Barbell Bench Press", body_part: "chest", category: "strength", equipment: ["barbell", "bench"], description: "Targets upper chest" },
  { name: "Decline Barbell Bench Press", body_part: "chest", category: "strength", equipment: ["barbell", "bench"], description: "Targets lower chest" },
  { name: "Dumbbell Bench Press", body_part: "chest", category: "strength", equipment: ["dumbbell", "bench"], description: "Allows greater range of motion" },
  { name: "Incline Dumbbell Press", body_part: "chest", category: "strength", equipment: ["dumbbell", "bench"], description: "Upper chest focus with dumbbells" },
  { name: "Decline Dumbbell Press", body_part: "chest", category: "strength", equipment: ["dumbbell", "bench"], description: "Lower chest focus with dumbbells" },
  { name: "Dumbbell Flyes", body_part: "chest", category: "strength", equipment: ["dumbbell", "bench"], description: "Chest isolation movement" },
  { name: "Incline Dumbbell Flyes", body_part: "chest", category: "strength", equipment: ["dumbbell", "bench"], description: "Upper chest isolation" },
  { name: "Cable Crossover", body_part: "chest", category: "strength", equipment: ["cable"], description: "Constant tension chest isolation" },
  { name: "Low Cable Crossover", body_part: "chest", category: "strength", equipment: ["cable"], description: "Targets upper chest fibers" },
  { name: "Pec Deck Fly", body_part: "chest", category: "strength", equipment: ["machine"], description: "Machine chest isolation" },
  { name: "Machine Chest Press", body_part: "chest", category: "strength", equipment: ["machine"], description: "Guided pressing movement" },
  { name: "Push-Ups", body_part: "chest", category: "strength", equipment: ["bodyweight"], description: "Fundamental bodyweight chest exercise" },
  { name: "Decline Push-Ups", body_part: "chest", category: "strength", equipment: ["bodyweight"], description: "Elevated feet push-up variation" },
  { name: "Diamond Push-Ups", body_part: "chest", category: "strength", equipment: ["bodyweight"], description: "Close grip push-up for inner chest" },
  { name: "Wide Push-Ups", body_part: "chest", category: "strength", equipment: ["bodyweight"], description: "Wide grip push-up variation" },
  { name: "Chest Dips", body_part: "chest", category: "strength", equipment: ["dip bars"], description: "Bodyweight pressing movement" },
  { name: "Landmine Press", body_part: "chest", category: "strength", equipment: ["barbell"], description: "Angled pressing movement" },
  { name: "Svend Press", body_part: "chest", category: "strength", equipment: ["plate"], description: "Plate squeeze press" },
  { name: "Floor Press", body_part: "chest", category: "strength", equipment: ["barbell", "dumbbell"], description: "Limited range pressing" },

  // BACK (25 exercises)
  { name: "Barbell Deadlift", body_part: "back", category: "strength", equipment: ["barbell"], description: "King of all exercises" },
  { name: "Sumo Deadlift", body_part: "back", category: "strength", equipment: ["barbell"], description: "Wide stance deadlift variation" },
  { name: "Romanian Deadlift", body_part: "back", category: "strength", equipment: ["barbell", "dumbbell"], description: "Hip hinge for hamstrings and lower back" },
  { name: "Barbell Row", body_part: "back", category: "strength", equipment: ["barbell"], description: "Classic horizontal pulling" },
  { name: "Pendlay Row", body_part: "back", category: "strength", equipment: ["barbell"], description: "Strict barbell row from floor" },
  { name: "Dumbbell Row", body_part: "back", category: "strength", equipment: ["dumbbell", "bench"], description: "Unilateral back exercise" },
  { name: "Seated Cable Row", body_part: "back", category: "strength", equipment: ["cable"], description: "Machine horizontal pulling" },
  { name: "T-Bar Row", body_part: "back", category: "strength", equipment: ["barbell", "machine"], description: "Compound back builder" },
  { name: "Pull-Ups", body_part: "back", category: "strength", equipment: ["pull-up bar"], description: "Bodyweight vertical pulling" },
  { name: "Chin-Ups", body_part: "back", category: "strength", equipment: ["pull-up bar"], description: "Supinated grip pull-up" },
  { name: "Lat Pulldown", body_part: "back", category: "strength", equipment: ["cable"], description: "Machine vertical pulling" },
  { name: "Wide Grip Lat Pulldown", body_part: "back", category: "strength", equipment: ["cable"], description: "Wide grip lat focus" },
  { name: "Close Grip Lat Pulldown", body_part: "back", category: "strength", equipment: ["cable"], description: "Close grip back exercise" },
  { name: "Straight Arm Pulldown", body_part: "back", category: "strength", equipment: ["cable"], description: "Lat isolation movement" },
  { name: "Face Pulls", body_part: "back", category: "strength", equipment: ["cable"], description: "Rear delt and upper back" },
  { name: "Rack Pulls", body_part: "back", category: "strength", equipment: ["barbell"], description: "Partial range deadlift" },
  { name: "Good Mornings", body_part: "back", category: "strength", equipment: ["barbell"], description: "Lower back and hamstring exercise" },
  { name: "Hyperextensions", body_part: "back", category: "strength", equipment: ["hyperextension bench"], description: "Lower back isolation" },
  { name: "Reverse Hyperextensions", body_part: "back", category: "strength", equipment: ["machine"], description: "Glute and lower back focus" },
  { name: "Meadows Row", body_part: "back", category: "strength", equipment: ["barbell"], description: "Landmine row variation" },
  { name: "Chest Supported Row", body_part: "back", category: "strength", equipment: ["dumbbell", "bench"], description: "Supported rowing movement" },
  { name: "Inverted Row", body_part: "back", category: "strength", equipment: ["barbell", "bodyweight"], description: "Bodyweight horizontal pull" },
  { name: "Seal Row", body_part: "back", category: "strength", equipment: ["barbell", "bench"], description: "Bench supported barbell row" },
  { name: "Kroc Row", body_part: "back", category: "strength", equipment: ["dumbbell"], description: "Heavy high rep dumbbell row" },
  { name: "Single Arm Cable Row", body_part: "back", category: "strength", equipment: ["cable"], description: "Unilateral cable pulling" },

  // SHOULDERS (20 exercises)
  { name: "Overhead Press", body_part: "shoulders", category: "strength", equipment: ["barbell"], description: "Standing barbell press" },
  { name: "Seated Dumbbell Press", body_part: "shoulders", category: "strength", equipment: ["dumbbell", "bench"], description: "Seated pressing movement" },
  { name: "Arnold Press", body_part: "shoulders", category: "strength", equipment: ["dumbbell"], description: "Rotational dumbbell press" },
  { name: "Push Press", body_part: "shoulders", category: "strength", equipment: ["barbell"], description: "Explosive overhead pressing" },
  { name: "Lateral Raises", body_part: "shoulders", category: "strength", equipment: ["dumbbell"], description: "Side delt isolation" },
  { name: "Front Raises", body_part: "shoulders", category: "strength", equipment: ["dumbbell", "plate"], description: "Front delt isolation" },
  { name: "Rear Delt Flyes", body_part: "shoulders", category: "strength", equipment: ["dumbbell"], description: "Rear deltoid isolation" },
  { name: "Cable Lateral Raises", body_part: "shoulders", category: "strength", equipment: ["cable"], description: "Constant tension side raises" },
  { name: "Upright Rows", body_part: "shoulders", category: "strength", equipment: ["barbell", "dumbbell"], description: "Compound shoulder exercise" },
  { name: "Machine Shoulder Press", body_part: "shoulders", category: "strength", equipment: ["machine"], description: "Guided overhead pressing" },
  { name: "Reverse Pec Deck", body_part: "shoulders", category: "strength", equipment: ["machine"], description: "Machine rear delt isolation" },
  { name: "Handstand Push-Ups", body_part: "shoulders", category: "strength", equipment: ["bodyweight"], description: "Advanced bodyweight pressing" },
  { name: "Pike Push-Ups", body_part: "shoulders", category: "strength", equipment: ["bodyweight"], description: "Shoulder focused push-up" },
  { name: "Z-Press", body_part: "shoulders", category: "strength", equipment: ["barbell", "dumbbell"], description: "Seated floor press" },
  { name: "Lu Raises", body_part: "shoulders", category: "strength", equipment: ["dumbbell"], description: "Front to lateral raise combination" },
  { name: "Bus Drivers", body_part: "shoulders", category: "strength", equipment: ["plate"], description: "Plate rotation exercise" },
  { name: "Behind the Neck Press", body_part: "shoulders", category: "strength", equipment: ["barbell"], description: "Behind neck overhead press" },
  { name: "Bradford Press", body_part: "shoulders", category: "strength", equipment: ["barbell"], description: "Front to back pressing" },
  { name: "Shrugs", body_part: "shoulders", category: "strength", equipment: ["barbell", "dumbbell"], description: "Trap development exercise" },
  { name: "Farmer's Walk", body_part: "shoulders", category: "strength", equipment: ["dumbbell", "kettlebell"], description: "Loaded carry for traps and grip" },

  // ARMS - BICEPS (15 exercises)
  { name: "Barbell Curl", body_part: "biceps", category: "strength", equipment: ["barbell"], description: "Classic bicep builder" },
  { name: "EZ Bar Curl", body_part: "biceps", category: "strength", equipment: ["ez bar"], description: "Wrist-friendly barbell curl" },
  { name: "Dumbbell Curl", body_part: "biceps", category: "strength", equipment: ["dumbbell"], description: "Standing dumbbell curl" },
  { name: "Hammer Curl", body_part: "biceps", category: "strength", equipment: ["dumbbell"], description: "Neutral grip bicep curl" },
  { name: "Preacher Curl", body_part: "biceps", category: "strength", equipment: ["barbell", "dumbbell"], description: "Isolated bicep curl" },
  { name: "Incline Dumbbell Curl", body_part: "biceps", category: "strength", equipment: ["dumbbell", "bench"], description: "Stretched bicep curl" },
  { name: "Concentration Curl", body_part: "biceps", category: "strength", equipment: ["dumbbell"], description: "Strict bicep isolation" },
  { name: "Cable Curl", body_part: "biceps", category: "strength", equipment: ["cable"], description: "Constant tension bicep curl" },
  { name: "Spider Curl", body_part: "biceps", category: "strength", equipment: ["dumbbell", "ez bar"], description: "Incline bench curl variation" },
  { name: "21s", body_part: "biceps", category: "strength", equipment: ["barbell", "dumbbell"], description: "Partial range rep scheme" },
  { name: "Zottman Curl", body_part: "biceps", category: "strength", equipment: ["dumbbell"], description: "Rotating forearm curl" },
  { name: "Reverse Curl", body_part: "biceps", category: "strength", equipment: ["barbell", "dumbbell"], description: "Pronated grip curl" },
  { name: "Cross Body Hammer Curl", body_part: "biceps", category: "strength", equipment: ["dumbbell"], description: "Diagonal hammer curl" },
  { name: "Machine Bicep Curl", body_part: "biceps", category: "strength", equipment: ["machine"], description: "Guided bicep curl" },
  { name: "Drag Curl", body_part: "biceps", category: "strength", equipment: ["barbell"], description: "Elbow back curl variation" },

  // ARMS - TRICEPS (15 exercises)
  { name: "Close Grip Bench Press", body_part: "triceps", category: "strength", equipment: ["barbell", "bench"], description: "Compound tricep builder" },
  { name: "Skull Crushers", body_part: "triceps", category: "strength", equipment: ["barbell", "ez bar"], description: "Lying tricep extension" },
  { name: "Tricep Dips", body_part: "triceps", category: "strength", equipment: ["dip bars"], description: "Bodyweight tricep exercise" },
  { name: "Tricep Pushdown", body_part: "triceps", category: "strength", equipment: ["cable"], description: "Cable tricep isolation" },
  { name: "Overhead Tricep Extension", body_part: "triceps", category: "strength", equipment: ["dumbbell", "cable"], description: "Overhead cable extension" },
  { name: "Rope Pushdown", body_part: "triceps", category: "strength", equipment: ["cable"], description: "Rope attachment pushdown" },
  { name: "Kickbacks", body_part: "triceps", category: "strength", equipment: ["dumbbell"], description: "Bent over tricep extension" },
  { name: "Diamond Push-Ups", body_part: "triceps", category: "strength", equipment: ["bodyweight"], description: "Close grip push-up" },
  { name: "JM Press", body_part: "triceps", category: "strength", equipment: ["barbell"], description: "Hybrid press and extension" },
  { name: "Tate Press", body_part: "triceps", category: "strength", equipment: ["dumbbell"], description: "Elbows out dumbbell extension" },
  { name: "French Press", body_part: "triceps", category: "strength", equipment: ["ez bar", "barbell"], description: "Seated overhead extension" },
  { name: "Single Arm Pushdown", body_part: "triceps", category: "strength", equipment: ["cable"], description: "Unilateral cable pushdown" },
  { name: "Bench Dips", body_part: "triceps", category: "strength", equipment: ["bench"], description: "Bodyweight bench dip" },
  { name: "Machine Tricep Extension", body_part: "triceps", category: "strength", equipment: ["machine"], description: "Guided tricep extension" },
  { name: "Rolling Tricep Extension", body_part: "triceps", category: "strength", equipment: ["dumbbell"], description: "Floor lying extension" },

  // LEGS - QUADS (20 exercises)
  { name: "Barbell Back Squat", body_part: "quads", category: "strength", equipment: ["barbell"], description: "King of leg exercises" },
  { name: "Front Squat", body_part: "quads", category: "strength", equipment: ["barbell"], description: "Quad dominant squat" },
  { name: "Goblet Squat", body_part: "quads", category: "strength", equipment: ["dumbbell", "kettlebell"], description: "Beginner friendly squat" },
  { name: "Leg Press", body_part: "quads", category: "strength", equipment: ["machine"], description: "Machine leg pressing" },
  { name: "Hack Squat", body_part: "quads", category: "strength", equipment: ["machine"], description: "Quad focused squat machine" },
  { name: "Walking Lunges", body_part: "quads", category: "strength", equipment: ["dumbbell", "barbell"], description: "Dynamic leg exercise" },
  { name: "Static Lunges", body_part: "quads", category: "strength", equipment: ["dumbbell", "barbell"], description: "Stationary lunge" },
  { name: "Reverse Lunges", body_part: "quads", category: "strength", equipment: ["dumbbell", "barbell"], description: "Step back lunge" },
  { name: "Bulgarian Split Squat", body_part: "quads", category: "strength", equipment: ["dumbbell", "barbell"], description: "Elevated rear foot split squat" },
  { name: "Leg Extension", body_part: "quads", category: "strength", equipment: ["machine"], description: "Quad isolation machine" },
  { name: "Step-Ups", body_part: "quads", category: "strength", equipment: ["dumbbell", "box"], description: "Box step up exercise" },
  { name: "Sissy Squat", body_part: "quads", category: "strength", equipment: ["bodyweight"], description: "Quad stretch squat" },
  { name: "Smith Machine Squat", body_part: "quads", category: "strength", equipment: ["smith machine"], description: "Guided squat movement" },
  { name: "Pistol Squat", body_part: "quads", category: "strength", equipment: ["bodyweight"], description: "Single leg squat" },
  { name: "Box Squat", body_part: "quads", category: "strength", equipment: ["barbell", "box"], description: "Squat to box" },
  { name: "Pause Squat", body_part: "quads", category: "strength", equipment: ["barbell"], description: "Paused at bottom squat" },
  { name: "Tempo Squat", body_part: "quads", category: "strength", equipment: ["barbell"], description: "Slow controlled squat" },
  { name: "Zercher Squat", body_part: "quads", category: "strength", equipment: ["barbell"], description: "Bar in elbow crease squat" },
  { name: "Belt Squat", body_part: "quads", category: "strength", equipment: ["machine"], description: "Hip belt squat machine" },
  { name: "Pendulum Squat", body_part: "quads", category: "strength", equipment: ["machine"], description: "Arc path squat machine" },

  // LEGS - HAMSTRINGS (12 exercises)
  { name: "Lying Leg Curl", body_part: "hamstrings", category: "strength", equipment: ["machine"], description: "Prone hamstring curl" },
  { name: "Seated Leg Curl", body_part: "hamstrings", category: "strength", equipment: ["machine"], description: "Seated hamstring curl" },
  { name: "Standing Leg Curl", body_part: "hamstrings", category: "strength", equipment: ["machine"], description: "Standing single leg curl" },
  { name: "Stiff Leg Deadlift", body_part: "hamstrings", category: "strength", equipment: ["barbell", "dumbbell"], description: "Straight leg hip hinge" },
  { name: "Single Leg Romanian Deadlift", body_part: "hamstrings", category: "strength", equipment: ["dumbbell"], description: "Unilateral RDL" },
  { name: "Nordic Curl", body_part: "hamstrings", category: "strength", equipment: ["bodyweight"], description: "Bodyweight hamstring exercise" },
  { name: "Glute Ham Raise", body_part: "hamstrings", category: "strength", equipment: ["GHD"], description: "Hip and knee flexion" },
  { name: "Kettlebell Swing", body_part: "hamstrings", category: "strength", equipment: ["kettlebell"], description: "Explosive hip hinge" },
  { name: "Cable Pull Through", body_part: "hamstrings", category: "strength", equipment: ["cable"], description: "Cable hip hinge" },
  { name: "Deficit Deadlift", body_part: "hamstrings", category: "strength", equipment: ["barbell"], description: "Elevated deadlift" },
  { name: "Sliding Leg Curl", body_part: "hamstrings", category: "strength", equipment: ["sliders"], description: "Floor hamstring curl" },
  { name: "Swiss Ball Leg Curl", body_part: "hamstrings", category: "strength", equipment: ["stability ball"], description: "Stability ball curl" },

  // LEGS - GLUTES (12 exercises)
  { name: "Hip Thrust", body_part: "glutes", category: "strength", equipment: ["barbell", "bench"], description: "Primary glute builder" },
  { name: "Glute Bridge", body_part: "glutes", category: "strength", equipment: ["barbell", "bodyweight"], description: "Floor glute exercise" },
  { name: "Single Leg Glute Bridge", body_part: "glutes", category: "strength", equipment: ["bodyweight"], description: "Unilateral glute bridge" },
  { name: "Cable Kickback", body_part: "glutes", category: "strength", equipment: ["cable"], description: "Cable glute isolation" },
  { name: "Donkey Kicks", body_part: "glutes", category: "strength", equipment: ["bodyweight"], description: "Bodyweight glute exercise" },
  { name: "Fire Hydrants", body_part: "glutes", category: "strength", equipment: ["bodyweight"], description: "Hip abduction exercise" },
  { name: "Sumo Squat", body_part: "glutes", category: "strength", equipment: ["dumbbell", "kettlebell"], description: "Wide stance squat" },
  { name: "Cable Pull Through", body_part: "glutes", category: "strength", equipment: ["cable"], description: "Hip hinge cable exercise" },
  { name: "Frog Pumps", body_part: "glutes", category: "strength", equipment: ["bodyweight"], description: "Butterfly position glute exercise" },
  { name: "Hip Abduction Machine", body_part: "glutes", category: "strength", equipment: ["machine"], description: "Outer glute machine" },
  { name: "Banded Walks", body_part: "glutes", category: "strength", equipment: ["resistance band"], description: "Lateral glute activation" },
  { name: "Clamshells", body_part: "glutes", category: "strength", equipment: ["resistance band"], description: "Side lying hip exercise" },

  // LEGS - CALVES (8 exercises)
  { name: "Standing Calf Raise", body_part: "calves", category: "strength", equipment: ["machine", "dumbbell"], description: "Gastrocnemius focus" },
  { name: "Seated Calf Raise", body_part: "calves", category: "strength", equipment: ["machine"], description: "Soleus focus" },
  { name: "Donkey Calf Raise", body_part: "calves", category: "strength", equipment: ["machine"], description: "Bent over calf raise" },
  { name: "Leg Press Calf Raise", body_part: "calves", category: "strength", equipment: ["machine"], description: "Calf raise on leg press" },
  { name: "Single Leg Calf Raise", body_part: "calves", category: "strength", equipment: ["bodyweight", "dumbbell"], description: "Unilateral calf work" },
  { name: "Smith Machine Calf Raise", body_part: "calves", category: "strength", equipment: ["smith machine"], description: "Guided calf raise" },
  { name: "Tibialis Raise", body_part: "calves", category: "strength", equipment: ["bodyweight"], description: "Shin muscle exercise" },
  { name: "Jump Rope", body_part: "calves", category: "cardio", equipment: ["jump rope"], description: "Cardio and calf conditioning" },

  // CORE (20 exercises)
  { name: "Plank", body_part: "core", category: "strength", equipment: ["bodyweight"], description: "Isometric core hold" },
  { name: "Side Plank", body_part: "core", category: "strength", equipment: ["bodyweight"], description: "Oblique focused plank" },
  { name: "Dead Bug", body_part: "core", category: "strength", equipment: ["bodyweight"], description: "Core stability exercise" },
  { name: "Bird Dog", body_part: "core", category: "strength", equipment: ["bodyweight"], description: "Core and balance exercise" },
  { name: "Ab Wheel Rollout", body_part: "core", category: "strength", equipment: ["ab wheel"], description: "Advanced core exercise" },
  { name: "Hanging Leg Raise", body_part: "core", category: "strength", equipment: ["pull-up bar"], description: "Lower ab focus" },
  { name: "Hanging Knee Raise", body_part: "core", category: "strength", equipment: ["pull-up bar"], description: "Beginner leg raise" },
  { name: "Cable Crunch", body_part: "core", category: "strength", equipment: ["cable"], description: "Weighted crunch" },
  { name: "Russian Twist", body_part: "core", category: "strength", equipment: ["plate", "dumbbell"], description: "Rotational core exercise" },
  { name: "Bicycle Crunch", body_part: "core", category: "strength", equipment: ["bodyweight"], description: "Cross body crunch" },
  { name: "Sit-Ups", body_part: "core", category: "strength", equipment: ["bodyweight"], description: "Classic ab exercise" },
  { name: "Crunches", body_part: "core", category: "strength", equipment: ["bodyweight"], description: "Upper ab focus" },
  { name: "Reverse Crunch", body_part: "core", category: "strength", equipment: ["bodyweight"], description: "Lower ab focus" },
  { name: "Mountain Climbers", body_part: "core", category: "cardio", equipment: ["bodyweight"], description: "Dynamic core exercise" },
  { name: "Pallof Press", body_part: "core", category: "strength", equipment: ["cable", "resistance band"], description: "Anti-rotation exercise" },
  { name: "Wood Chops", body_part: "core", category: "strength", equipment: ["cable", "dumbbell"], description: "Rotational core movement" },
  { name: "Toes to Bar", body_part: "core", category: "strength", equipment: ["pull-up bar"], description: "Advanced leg raise" },
  { name: "Dragon Flag", body_part: "core", category: "strength", equipment: ["bench"], description: "Advanced core exercise" },
  { name: "L-Sit", body_part: "core", category: "strength", equipment: ["dip bars", "floor"], description: "Isometric hip flexor hold" },
  { name: "Hollow Body Hold", body_part: "core", category: "strength", equipment: ["bodyweight"], description: "Gymnastic core hold" },

  // CARDIO (20 exercises)
  { name: "Treadmill Running", body_part: "cardio", category: "cardio", equipment: ["treadmill"], description: "Indoor running" },
  { name: "Outdoor Running", body_part: "cardio", category: "cardio", equipment: ["none"], description: "Outdoor cardio" },
  { name: "Cycling", body_part: "cardio", category: "cardio", equipment: ["bike", "stationary bike"], description: "Low impact cardio" },
  { name: "Rowing Machine", body_part: "cardio", category: "cardio", equipment: ["rowing machine"], description: "Full body cardio" },
  { name: "Stair Climber", body_part: "cardio", category: "cardio", equipment: ["stair climber"], description: "Leg focused cardio" },
  { name: "Elliptical", body_part: "cardio", category: "cardio", equipment: ["elliptical"], description: "Low impact full body cardio" },
  { name: "Swimming", body_part: "cardio", category: "cardio", equipment: ["pool"], description: "Full body water cardio" },
  { name: "Battle Ropes", body_part: "cardio", category: "cardio", equipment: ["battle ropes"], description: "Upper body cardio" },
  { name: "Box Jumps", body_part: "cardio", category: "cardio", equipment: ["box"], description: "Explosive cardio" },
  { name: "Burpees", body_part: "cardio", category: "cardio", equipment: ["bodyweight"], description: "Full body conditioning" },
  { name: "Jumping Jacks", body_part: "cardio", category: "cardio", equipment: ["bodyweight"], description: "Basic cardio exercise" },
  { name: "High Knees", body_part: "cardio", category: "cardio", equipment: ["bodyweight"], description: "Running in place" },
  { name: "Butt Kicks", body_part: "cardio", category: "cardio", equipment: ["bodyweight"], description: "Hamstring activation cardio" },
  { name: "Ski Erg", body_part: "cardio", category: "cardio", equipment: ["ski erg"], description: "Upper body cardio machine" },
  { name: "Assault Bike", body_part: "cardio", category: "cardio", equipment: ["assault bike"], description: "Full body conditioning" },
  { name: "Sled Push", body_part: "cardio", category: "cardio", equipment: ["sled"], description: "Conditioning exercise" },
  { name: "Sled Pull", body_part: "cardio", category: "cardio", equipment: ["sled"], description: "Pulling conditioning" },
  { name: "Prowler Push", body_part: "cardio", category: "cardio", equipment: ["prowler"], description: "Leg drive conditioning" },
  { name: "Walking", body_part: "cardio", category: "cardio", equipment: ["none"], description: "Low intensity steady state" },
  { name: "Incline Treadmill Walk", body_part: "cardio", category: "cardio", equipment: ["treadmill"], description: "Low impact incline cardio" },

  // FLEXIBILITY/MOBILITY (15 exercises)
  { name: "Foam Rolling - Back", body_part: "mobility", category: "flexibility", equipment: ["foam roller"], description: "Back myofascial release" },
  { name: "Foam Rolling - Quads", body_part: "mobility", category: "flexibility", equipment: ["foam roller"], description: "Quad myofascial release" },
  { name: "Hip Flexor Stretch", body_part: "mobility", category: "flexibility", equipment: ["bodyweight"], description: "Hip flexor flexibility" },
  { name: "Pigeon Pose", body_part: "mobility", category: "flexibility", equipment: ["bodyweight"], description: "Hip opener stretch" },
  { name: "Cat-Cow Stretch", body_part: "mobility", category: "flexibility", equipment: ["bodyweight"], description: "Spine mobility" },
  { name: "World's Greatest Stretch", body_part: "mobility", category: "flexibility", equipment: ["bodyweight"], description: "Full body stretch" },
  { name: "90/90 Hip Stretch", body_part: "mobility", category: "flexibility", equipment: ["bodyweight"], description: "Hip internal rotation" },
  { name: "Thoracic Spine Extension", body_part: "mobility", category: "flexibility", equipment: ["foam roller"], description: "Upper back mobility" },
  { name: "Shoulder Pass Throughs", body_part: "mobility", category: "flexibility", equipment: ["pvc pipe", "band"], description: "Shoulder mobility" },
  { name: "Ankle Mobility Drill", body_part: "mobility", category: "flexibility", equipment: ["bodyweight"], description: "Ankle dorsiflexion" },
  { name: "Lying Spinal Twist", body_part: "mobility", category: "flexibility", equipment: ["bodyweight"], description: "Spine rotation stretch" },
  { name: "Standing Quad Stretch", body_part: "mobility", category: "flexibility", equipment: ["bodyweight"], description: "Quad flexibility" },
  { name: "Hamstring Stretch", body_part: "mobility", category: "flexibility", equipment: ["bodyweight"], description: "Hamstring flexibility" },
  { name: "Chest Doorway Stretch", body_part: "mobility", category: "flexibility", equipment: ["doorway"], description: "Pec stretch" },
  { name: "Lat Stretch", body_part: "mobility", category: "flexibility", equipment: ["bodyweight"], description: "Lat flexibility" },
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if exercises already exist
    const { count } = await supabase
      .from('exercises')
      .select('*', { count: 'exact', head: true })
      .eq('is_global', true)

    if (count && count > 0) {
      return new Response(
        JSON.stringify({ message: `Exercise library already seeded with ${count} exercises` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Insert all exercises
    const exercisesToInsert = exercises.map(e => ({
      ...e,
      is_global: true,
      created_by: null,
      instructions: []
    }))

    const { data, error } = await supabase
      .from('exercises')
      .insert(exercisesToInsert)
      .select()

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        message: `Successfully seeded ${data.length} exercises`,
        count: data.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})