import styles from './DeleteMultiplePopup.module.css'; 

const DeleteMultiplePopup = ({ show, onClose, onConfirm, selectedItems, itemList, itemLabel = 'gasto'}) => {
    if (!show) return null;

    const selected = itemList.filter(item => selectedItems.includes(item.id));
    const total = selected.reduce((sum, item) => sum + item.valorTotal, 0);

    return (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <div className={styles.popupHeader}>
              <header>
                <span>Confirmar Exclusão</span>
              </header>
              <button className={styles.closeButton} onClick={onClose}>×</button>
            </div>
    
            <div className={styles.popupContent}>
              <div className={styles.confirmMessage}>
                <span>
                  Tem certeza que deseja excluir {selected.length} {itemLabel}{selected.length > 1 ? 's' : ''}?
                </span>
    
                <div className={styles.selectedGastosList}>
                  <h4>{itemLabel[0].toUpperCase() + itemLabel.slice(1)}s selecionados:</h4>
                  <div className={styles.gastosList}>
                    {selected.map(item => (
                      <div key={item.id} className={styles.gastoItem}>
                        {itemLabel === 'gasto' && (
                          <div className={styles.gastoInfo}>
                            <strong>{item.descricao}</strong>
                            <span className={styles.gastoValor}>
                              {item.valorTotal.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              })}
                            </span>
                          </div>
                        )}
                        {itemLabel === 'funcionário' && (
                          <div className={styles.gastoInfo}>
                            <strong>{item.nome}</strong>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
    
                  {itemLabel === 'gasto' && (
                    <div className={styles.totalValue}>
                      <strong>
                        Total:{' '}
                        {total.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </strong>
                    </div>
                  )}

                </div>
              </div>
            </div>
    
            <div className={styles.popupFooter}>
              <button className={styles.buttonCancel} onClick={onClose}>
                Cancelar
              </button>
              <button className={styles.buttonDelete} onClick={onConfirm}>
                Excluir {selected.length} {itemLabel}{selected.length > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
    );
};

export default DeleteMultiplePopup;
