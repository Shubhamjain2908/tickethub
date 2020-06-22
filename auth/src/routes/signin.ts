import express from "express";

const router = express.Router();

router.post('/api/users/signin', (req, res) => {
    res.send('CKMB from signin!');
});

export { router as signinRouter };