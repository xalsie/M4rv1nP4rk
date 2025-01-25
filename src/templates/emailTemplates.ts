export const emailTemplates = {
    confirmation: (username: string, confirmationLink: string) => `
        <div>
            <h2>Bienvenue, ${username} !</h2>
            <span>CONFIRMER MON COMPTE : </span><span>${confirmationLink}</span>
        </div>
    `,

    passwordReset: (resetLink: string) => `
        <div>            
            <h2>Réinitialisation de votre mot de passe</h2>
            <span>CONFIRMER MON COMPTE : </span><span>${resetLink}</span>
        </div>
    `,
};
