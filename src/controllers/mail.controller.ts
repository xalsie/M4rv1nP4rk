import { Request, Response } from 'express';
import { env } from '../env';
import { mailService } from '../services/mail.service';

export const sendConfirmationEmail = async (req: Request, res: Response) => {
    const { email, username } = req.body;

    try {
        const confirmationLink = `${env.API_HOST}:${env.API_PORT}/auth/confirm/${email}`;

        await mailService.sendTemplatedEmail({
            to: email,
            subject: 'Confirme ton inscription',
            template: 'confirmation',
            data: { username, confirmationLink }
        });

        res.status(200).json({ message: 'E-mail de confirmation envoyé avec succès !' });
    } catch (error: any) {
        console.error('Erreur lors de l\'envoi de l\'e-mail de confirmation :', error.message);
        res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail.' });
    }
};

export const sendPasswordResetEmail = async (req: Request, res: Response) => {
    const { email, resetToken } = req.body;

    try {
        const resetLink = `${env.API_HOST}:${env.API_PORT}/auth/reset-password/${resetToken}`;
        
        await mailService.sendTemplatedEmail({
            to: email,
            subject: 'Réinitialise ton mot de passe',
            template: 'passwordReset',
            data: { resetLink }
        });

        res.status(200).json({ message: 'E-mail de réinitialisation envoyé avec succès !' });
    } catch (error: any) {
        res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail.' });
    }
};
