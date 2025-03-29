const Total = (props: { total: number, itemDescription?: string }) => {
    const { total, itemDescription } = props
    return (
      <div className="pagination-total">
        Total <span>{total}</span> {itemDescription ?? 'Items'}
      </div>
    );
}

export default Total
