/**
 * 
 * @returns Retorna un numero aleatorio de 10 digitos, especialemente para números de radicado
 * @example 1796473794
 */

export const generarNumeroRadicado = () => {
    const radicado = Math.floor(1000000000 + Math.random() * 9000000000);
    return radicado;
}
