const router = require("express").Router();
const { workout } = require("../../models");

router.get("/", (req, res) => {
  workout
    .aggregate([
      {
        $addFields: {
          totalDuration: { $sum: "$exercises.duration" },
        },
      },
    ])
    .then((workout) => {
      res.json(workout);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/", (req, res) => {
  workout
    .create({ type: "workout" })
    .then((workout) => {
      res.json(workout);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/:id", (req, res) => {
  workout
    .create({
      type: req.body.type,
      name: req.body.name,
      duration: req.body.duration,
      weight: req.body.weight,
      reps: req.body.reps,
      sets: req.body.sets,
      distance: req.body.distance,
    })
    .then((newExercise) => {
      res.json(newExercise);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.put("/:id", ({ body, params }, res) => {
  const workoutId = params.id;
  let savedExercises = [];

  workout
    .find({ _id: workoutId })
    .then((dbworkout) => {
      savedExercises = dbworkout[0].exercises;
      res.json(dbworkout[0].exercises);
      let allExercises = [...savedExercises, body];
      console.log(allExercises);
      updateworkout(allExercises);
    })
    .catch((err) => {
      res.json(err);
    });

  function updateworkout(exercises) {
    workout.findByIdAndUpdate(
      workoutId,
      { exercises: exercises },
      function (err, doc) {
        if (err) {
          console.log(err);
        }
      }
    );
  }
});

router.get("/range", (req, res) => {
  workout
    .aggregate([
      {
        $addFields: {
          totalDuration: { $sum: "$exercises.duration" },
        },
      },
    ])
    .sort({ day: -1 })
    .limit(7)
    .sort({ day: 1 })
    .then((workout) => {
      res.json(workout);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
