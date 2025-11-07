const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: 'fas fa-users',
      color: 'primary'
    },
    {
      title: 'Total Registrations', 
      value: stats.totalRegistrations,
      icon: 'fas fa-user-graduate',
      color: 'success'
    },
    {
      title: 'Admin Users',
      value: stats.adminUsers,
      icon: 'fas fa-user-shield',
      color: 'warning'
    },
    {
      title: 'Regular Users',
      value: stats.regularUsers,
      icon: 'fas fa-user',
      color: 'info'
    }
  ];

  return (
    <div className="stats-cards">
      <div className="row">
        {cards.map((card, index) => (
          <div key={index} className="col-xl-3 col-lg-6 col-md-6">
            <div className={`stats-card ${card.color}`}>
              <div className="stats-card-body">
                <div className="stats-info">
                  <h3>{card.value}</h3>
                  <p>{card.title}</p>
                </div>
                <div className="stats-icon">
                  <i className={card.icon}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;