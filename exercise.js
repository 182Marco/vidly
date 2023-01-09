const getCustomer = id =>
  new Promise((res, rej) =>
    setTimeout(() => {
      res({
        id: id,
        name: 'Mosh Hamedani',
        isGold: true,
        email: 'email',
      })
    }, 2000),
  )

const getTopMovies = () =>
  new Promise((res, rej) => setTimeout(() => res(['movie1', 'movie2']), 1000))

const sendEmail = (email, movies) =>
  new Promise((res, rej) => setTimeout(() => res(), 1500))

const dealWithCostumer = async () => {
  const customer = await getCustomer(1)
  console.log(customer)
  if (customer.isGold) {
    const movies = await getTopMovies()
    console.log(movies)
    const sendedEmail = await sendEmail(customer.email, movies)
    console.log('Email sent...')
  }
}

dealWithCostumer(1)
