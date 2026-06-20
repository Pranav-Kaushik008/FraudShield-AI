function ChartCard({ title, children }) {

  return (

    <div className="bg-white p-6 rounded-xl shadow-lg">

      <h2 className="text-xl font-bold mb-4">

        {title}

      </h2>

      {children}

    </div>

  );

}

export default ChartCard;