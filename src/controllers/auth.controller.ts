import { NextFunction, Request, Response, Router } from "express";
import { generateToken } from "../middlewares/jwt";
import { sessionMiddleware } from "../middlewares/session.middleware";
import validateCreateUser from "../middlewares/validator/validateUser";
import { Bcrypt, generateResetToken } from "../utils";
import { mailService } from "../services/mail.service";
import { env } from "../env";
import { SequelizeService } from "../services/sequelize";
import { z, ZodError } from "zod"

export class AuthController {
    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     summary: Register a new user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - firstname
     *               - lastname
     *               - email
     *               - password
     *             properties:
     *               firstname:
     *                 type: string
     *                 description: Prénom de l'utilisateur
     *               lastname:
     *                 type: string
     *                 description: Nom de l'utilisateur
     *               email:
     *                 type: string
     *                 description: Email de l'utilisateur
     *               password:
     *                 type: string
     *                 description: Mot de passe de l'utilisateur
     *             example:
     *               firstname: John
     *               lastname: Doe
     *               email: johndoe@example.com
     *               password: myP@ssword123
     *     responses:
     *       201:
     *         description: User registered successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 response:
     *                   type: boolean
     *                   description: true
     *                 message:
     *                   type: string
     *                   description: Un email de confirmation vous a été envoyé
     *       400:
     *         description: Bad request
     *       409:
     *         description: Conflict
     *       500:
     *         description: Server error
     */
    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const UserSchema = z.object({
            firstname: z.string().trim().min(3).max(50),
            lastname: z.string().trim().min(3).max(50),
            email: z.string().email(),
            password: z.string(),
            tel: z.string().optional()
        })
        try {
            if (!req.body || UserSchema.safeParse(req.body)) {
                console.log(req.body);
                res.status(400).json({
                    message: "firstname, lastname, email and password are required"
                });
                return;
            }

            const verificationToken = generateResetToken();
            const tokenExpiration = new Date();
            tokenExpiration.setHours(tokenExpiration.getHours() + 24);

            const bcryptInstance = new Bcrypt();

            const sequelizeService = await SequelizeService.get();

            const user = await sequelizeService.userService.createUser({
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                email: req.body.email,
                tel: req.body.tel || null,
                role: "ROLE_USER",
                password: await bcryptInstance.hashPassword(req.body.password),
                isEmailVerified: false,
                emailVerificationToken: verificationToken,
                emailVerificationTokenExpires: tokenExpiration,
                resetPasswordToken: null,
                resetPasswordExpires: null
            });

            await mailService.sendTemplatedEmail({
                to: user.email,
                subject: 'Confirme ton inscription',
                template: 'confirmation',
                data: {
                    username: user.firstName + ' ' + user.lastName || 'Utilisateur',
                    confirmationLink: `${env.API_HOST}:${env.API_PORT}/api/auth/verify-email/${verificationToken}`
                }
            });

            res.status(201).json({
                response: true,
                message: "Un email de confirmation vous a été envoyé"
            });
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    message: "Invalid data",
                    errors: error.errors
                });
                return;
            }

            next(error);
        }
    };

    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: Login a user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 description: Email de l'utilisateur
     *               password:
     *                 type: string
     *                 description: Mot de passe de l'utilisateur
     *             example:
     *               email: johndoe@example.com
     *               password: myP@ssword123
     *     responses:
     *       201:
     *         description: User logged in successfully and Session created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/User'
     *                 jwtToken:
     *                   type: string
     *                   description: JWT Token
     *       400:
     *         description: Invalid credentials
     *       404:
     *         description: User not found
     */
    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const UserSchema = z.object({
                email: z.string(),
                password: z.string()
            })
        
            if (!req.body || UserSchema.safeParse(req.body).success === false) {
                res.status(400).json({
                    message: "Email and password are required"
                });
                return;
            }

            const sequelizeService = await SequelizeService.get();

            const user = await sequelizeService.userService.findUser(req.body.email);

            if (!user) {
                res.status(401).json({
                    message: "Invalid credentials"
                });
                return;
            }

            if (!user.isEmailVerified) {
                res.status(403).json({
                    message: "Veuillez vérifier votre email avant de vous connecter"
                });
                return;
            }

            const bcryptInstance = new Bcrypt();
            const passwordMatch = await bcryptInstance.comparePassword(
                req.body.password,
                user.password
            );

            if (!passwordMatch) {
                res.status(401).json({
                    message: "Invalid credentials"
                });
                return;
            }

            const jwtToken = generateToken(user);
            user.password = "";

            res.status(200).json({
                user: user,
                jwtToken: jwtToken
            });
        } catch (error) {
            console.error("Login error:", error);
            if (error instanceof ZodError) {
                res.status(400).json({
                    message: "Invalid data",
                    errors: error.errors
                });
                return;
            }
            res.status(401).json({
                message: "Invalid credentials"
            });
        }
    };

    me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        res.json(req.session!.user);
    };

    /**
     * @swagger
     * /api/auth/verify-email/{token}:
     *  get:
     *    summary: Verify user email
     *    tags: [Auth]
     *    parameters:
     *      - in: path
     *        name: token
     *        schema:
     *          type: string
     *        required: true
     *        description: Token de vérification
     *    responses:
     *      200:
     *        description: Email vérifié avec succès
     *        content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: Email vérifié avec succès
     *      401:
     *        description: Unauthorized
     *      403:
     *        description: Forbidden
     *      404:
     *        description: Not found
     *      500:
     *        description: Server error
     */
    verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { token } = req.params;
            const tokenCheck = z.string().min(64).max(64);

            console.log(token);

            if (!token || tokenCheck.safeParse(token).success === false) {
                res.status(400);
                throw new Error("Token manquant");
            }

            const sequelizeService = await SequelizeService.get();

            const user = await sequelizeService.userService.findUserByVerificationToken(token as string);

            if (!user) {
                res.status(404);
                throw new Error("Token invalide");
            }

            if (!user.emailVerificationTokenExpires || user.emailVerificationTokenExpires < new Date()) {
                res.status(400);
                throw new Error("Token expiré");
            }

            await sequelizeService.userService.updateUser(user.id, {
                isEmailVerified: true,
                emailVerificationToken: null,
                emailVerificationTokenExpires: null
            });

            res.status(200).json({ message: "Email vérifié avec succès" });
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    message: "Invalid data",
                    errors: error.errors
                });
                return;
            }
            next(error);
        }
    };

    /**
     * @swagger
     * /api/auth/forgot-password:
     *   post:
     *     summary: Request password reset
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *             properties:
     *               email:
     *                 type: string
     *                 description: Email de l'utilisateur
     *             example:
     *               email: johndoe@example.com
     *     responses:
     *       200:
     *         description: Reset email sent successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: Email de réinitialisation envoyé avec succès.
     *       400:
     *         description: Bad request
     *       404:
     *         description: User not found
     *       500:
     *         description: Server error
     */
    forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email } = req.body;
            const emailSchema = z.object({
                email: z.string().email()
            })

            if (!req.body || emailSchema.parse(email)) {
                res.status(400).json({ message: "Email est requis." });
                return;
            }

            const sequelizeService = await SequelizeService.get();

            const user = await sequelizeService.userService.findUser(req.body.email);

            if (!user) {
                res.status(404).json({ message: "Aucun compte n'est associé à cette adresse email." });
                return;
            }

            const resetToken = generateResetToken();
            await sequelizeService.userService.updateUser(user.id, {
                resetPasswordToken: resetToken,
                resetPasswordExpires: new Date(Date.now() + 3600000) // Token valide 1 heure
            });

            // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
            const resetLink = `${env.API_HOST}:${env.API_PORT}/api/auth/reset-password/${resetToken}`;
            await mailService.sendTemplatedEmail({
                to: user.email,
                subject: 'Réinitialisation de votre mot de passe',
                template: 'passwordReset',
                data: { resetLink }
            });

            res.status(200).json({ message: 'Email de réinitialisation envoyé avec succès.' });
        } catch (error) {
            console.error('Erreur lors de la demande de réinitialisation du mot de passe:', error);
            if (error instanceof ZodError) {
                res.status(400).json({
                    message: "Invalid data",
                    errors: error.errors
                });
                return;
            }
            res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation du mot de passe.' });
        }
    };

    /**
     * @swagger
     * /api/auth/reset-password:
     *   post:
     *     summary: Reset user password
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - token
     *               - password
     *             properties:
     *               token:
     *                 type: string
     *                 description: Token de réinitialisation
     *               password:
     *                 type: string
     *                 description: Nouveau mot de passe
     *             example:
     *               token: a1b2c3d4e5f6...
     *               password: newSecurePassword123
     *     responses:
     *       200:
     *         description: Password reset successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: Mot de passe réinitialisé avec succès.
     *       400:
     *         description: Invalid token or password
     *       404:
     *         description: Token not found
     *       500:
     *         description: Server error
     */
    resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { token, password } = req.body;
            const resetSchema = z.object({
                token: z.string().min(64).max(64),
                password: z.string()
            })

            if (!token || !password || resetSchema.parse(req.body)) {
                res.status(400).json({ message: 'Token et mot de passe sont requis.' });
                return;
            }

            const sequelizeService = await SequelizeService.get();

            const user = await sequelizeService.userService.findUserByResetToken(token);

            if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
                res.status(400).json({ message: 'Le lien de réinitialisation est invalide ou a expiré.' });
                return;
            }

            const bcryptInstance = new Bcrypt();
            const hashedPassword = await bcryptInstance.hashPassword(password);

            await sequelizeService.userService.updateUser(user.id, {
                password: hashedPassword,
                resetPasswordToken: undefined,
                resetPasswordExpires: undefined
            });

            res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', error);

            if (error instanceof ZodError) {
                res.status(400).json({
                    message: "Invalid data",
                    errors: error.errors
                });
                return;
            }

            res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe.' });
        }
    };

    buildRouter(): Router {
        const router = Router();
        router.post("/register", validateCreateUser, this.register);
        router.post("/login", this.login);
        router.get("/me", sessionMiddleware(), this.me);
        router.get("/verify-email/:token", this.verifyEmail);
        router.post("/forgot-password", this.forgotPassword);
        router.post("/reset-password", this.resetPassword);
        return router;
    }
}
