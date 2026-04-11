import { banks } from '../data/banks'

function Rating() {
  const sortedByDEA = [...banks].sort((a, b) => a.deaRank - b.deaRank)
  const sortedByShare = [...banks].sort((a, b) => b.marketShare - a.marketShare)
  const sortedByPhysical = [...banks].sort((a, b) => b.physicalLoansShare - a.physicalLoansShare)

  const getRankBadge = (rank) => {
    if (rank <= 5) return <span className="badge badge-success">Топ-5</span>
    if (rank <= 15) return <span className="badge badge-warning">Средний</span>
    return <span className="badge badge-danger">Низкий</span>
  }

  return (
    <div className="rating-page">
      <h1 className="page-title animate-in">Рейтинг банков</h1>
      <p className="page-subtitle animate-in stagger-1">
        Сравнение эффективности банков Республики Беларусь
      </p>

      <div className="card animate-in stagger-2" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>
          Рейтинг по DEA-эффективности
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          DEA (Data Envelopment Analysis) — метод оценки относительной эффективности. 
          Чем ниже номер позиции, тем эффективнее банк использует свои ресурсы.
        </p>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Банк</th>
                <th>Позиция DEA</th>
                <th>Доля рынка</th>
                <th>Доля кредитов физлиц</th>
                <th>Кредитный портфель</th>
              </tr>
            </thead>
            <tbody>
              {sortedByDEA.map((bank, index) => (
                <tr key={bank.id}>
                  <td>
                    <span style={{ 
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: index < 3 ? 'var(--color-accent)' : 'var(--color-text-muted)'
                    }}>
                      {index + 1}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{bank.logo}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{bank.name}</div>
                        {getRankBadge(bank.deaRank)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      fontFamily: 'var(--font-display)', 
                      fontSize: '1.3rem',
                      color: bank.deaRank <= 10 ? 'var(--color-success)' : 'var(--color-warning)'
                    }}>
                      {bank.deaRank} / 23
                    </span>
                  </td>
                  <td>{bank.marketShare}%</td>
                  <td>{bank.physicalLoansShare}%</td>
                  <td>{(bank.totalCredits / 1000).toFixed(0)}K тыс. BYN</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }} className="animate-in stagger-3">
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '1rem' }}>
            Топ-5 по доле рынка
          </h3>
          {sortedByShare.slice(0, 5).map((bank, index) => (
            <div key={bank.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: index < 4 ? '1px solid var(--color-border)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{bank.logo}</span>
                <span>{bank.name}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}>
                {bank.marketShare}%
              </span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '1rem' }}>
            Топ-5 по кредитам физлицам
          </h3>
          {sortedByPhysical.slice(0, 5).map((bank, index) => (
            <div key={bank.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: index < 4 ? '1px solid var(--color-border)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{bank.logo}</span>
                <span>{bank.name}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', color: 'var(--color-success)' }}>
                {bank.physicalLoansShare}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card animate-in stagger-4" style={{ marginTop: '2rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '1rem' }}>
          Выводы по анализу
        </h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>Лидер по эффективности</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              <strong style={{ color: 'var(--color-text)' }}>СтатусБанк</strong> занимает 1 место в рейтинге DEA, 
              несмотря на минимальные активы. Это говорит о максимальной эффективности использования ресурсов.
            </p>
          </div>
          
          <div style={{ padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-warning)' }}>Парадокс Беларусбанка</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              <strong style={{ color: 'var(--color-text)' }}>Беларусбанк</strong> имеет максимальные активы, 
              но занимает лишь 22 место в DEA-рейтинге. Это указывает на неэффективное использование ресурсов 
              при огромном масштабе операций.
            </p>
          </div>
          
          <div style={{ padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-success)' }}>Рост кредитования</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Задолженность по кредитам физлиц в банковской системе выросла на <strong style={{ color: 'var(--color-text)' }}>62.96%</strong> 
              за 2021-2023 гг., что свидетельствует о растущем спросе на кредитные услуги.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rating
