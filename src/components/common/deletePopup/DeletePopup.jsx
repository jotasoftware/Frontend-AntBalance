import styles from './DeletePopup.module.css'; 

const DeletePopup = ({ show, onClose, onConfirm, infoToDelete, type='GASTO', loading}) => {
    if (!show) return null;
    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popup}>
                <div className={styles.popupHeader}>
                <header>
                    <span>Confirmar Exclusão</span>
                </header>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                >
                    ×
                </button>
                </div>
                <div className={styles.popupContent}>
                    <div className={styles.confirmMessage}>
                        <span>
                            Tem certeza que deseja excluir{" "}
                            {type === "GASTO" && "o gasto"}
                            {type === "FUNCIONARIO" && "o funcionario"}
                            {type === "CATEGORIA" && "a categoria"}?
                        </span>

                        {infoToDelete && (
                            <div className={styles.gastoInfo}>
                            <strong>
                                {type === "GASTO" && infoToDelete.descricao}
                                {type === "FUNCIONARIO" && infoToDelete.nome}
                                {type === "CATEGORIA" && infoToDelete.nome}
                            </strong>

                            {type === "GASTO" && (
                                <span className={styles.gastoValor}>
                                Valor:{" "}
                                {infoToDelete.valorTotal.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                                </span>
                            )}
                            </div>
                        )}
                    </div>

                </div>
                <div className={styles.popupFooter}>
                <button
                    className={styles.buttonCancel}
                    onClick={onClose}
                >
                    Cancelar
                </button>
                <button
                    className={`${styles.buttonDelete} ${loading ? styles.loading : ''}`}
                    onClick={onConfirm}
                    disabled={loading}
                    >
                    {loading ? 'Excluindo...' : 'Excluir'}
                </button>
                </div>
            </div>
        </div>
    );
};

export default DeletePopup;
