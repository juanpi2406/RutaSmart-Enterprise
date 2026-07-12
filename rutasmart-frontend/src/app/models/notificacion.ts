export interface Notificacion {
    idNotificacion: number;
    idUsuario: number;
    titulo: string;
    mensaje: string;
    tipo: string;
    leido: boolean;
    fechaEnvio?: string;
}
