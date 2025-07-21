export function getBrasiliaDateTime() {
    const agora = new Date();
    const brasilia = new Date(
      agora.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
    );
  
    return brasilia.toISOString().split('.')[0];
}