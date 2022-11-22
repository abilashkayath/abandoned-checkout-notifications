


const setCartCreation = (req, res) => {
  const abandonedCheckoutData = getCheckoutDetails();


};


async function getCheckoutDetails() {
  const response = await fetch(
    "https://abhilash-1995.myshopify.com/admin/api/2022-10/checkouts.json"
  );
  const data = await response.json();

  return data;
}

function setJobTimeInterval(id, data) {
    const { name, time, type } = data;
    const date = dayjs().add(time, type);
  
    const schedulerString = `${date.minute()} ${date.hour()} ${date.date()} ${date.month()} *`;
    setJob(`${id}+${name}`, schedulerString);
  }

  