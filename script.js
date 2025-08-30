// Main app data and modal management
function appData() {
  return {
    // Modal states
    showProfile: false,
    showSettings: false,
    showLogoutConfirm: false,
    
    // Settings data
    settings: {
      notifications: {
        realtime: true,
        email: false
      },
      api: {
        refreshInterval: 30,
        autoRefresh: true
      },
      dashboard: {
        animations: true,
        compact: false
      }
    },
    
    // Methods
    init() {
      this.loadSettings()
    },
    
    logout() {
      this.showLogoutConfirm = true
    },
    
    confirmLogout() {
      // Simulate logout process
      showNotification('Logging out...', 'info')
      
      setTimeout(() => {
        // Clear user data
        localStorage.removeItem('dashboardTasks')
        localStorage.removeItem('userSettings')
        
        // Show logout success
        showNotification('Successfully logged out!', 'success')
        
        // Simulate redirect to login
        setTimeout(() => {
          showNotification('Redirecting to login...', 'info')
          // In a real app, you would redirect to login page
          // window.location.href = '/login'
        }, 1000)
        
        this.showLogoutConfirm = false
      }, 1500)
    },
    
    saveSettings() {
      localStorage.setItem('userSettings', JSON.stringify(this.settings))
      showNotification('Settings saved successfully!', 'success')
      this.showSettings = false
    },
    
    loadSettings() {
      const saved = localStorage.getItem('userSettings')
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) }
      }
    }
  }
}

// Dashboard main data and functionality
function dashboard() {
  return {
    // State
    chartPeriod: '30d',
    showAddTask: false,
    newTask: '',
    loading: {
      stats: false,
      weather: false,
      news: false,
    },

    // Statistics
    stats: {
      revenue: 0,
      users: 0,
      orders: 0,
      conversionRate: 0,
    },

    // Real-time data
    cryptoPrices: [],
    newsData: [],

    // Recent activity data
    recentActivity: [],

    // Tasks
    tasks: [
      { id: 1, title: 'Review customer feedback', completed: false },
      { id: 2, title: 'Update product descriptions', completed: true },
      { id: 3, title: 'Prepare monthly report', completed: false },
      { id: 4, title: 'Schedule team meeting', completed: false },
      { id: 5, title: 'Optimize database queries', completed: true },
    ],

    // Methods
    async init() {
      this.initChart()
      this.loadTasks()
      await this.loadRealTimeData()
    },

    async loadRealTimeData() {
      await Promise.all([
        this.fetchCryptoPrices(),
        this.fetchNews(),
        this.fetchRandomUserData(),
      ])
    },

    // Fetch real cryptocurrency prices
    async fetchCryptoPrices() {
      try {
        this.loading.stats = true
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin&vs_currencies=usd&include_24hr_change=true'
        )
        const data = await response.json()

        // Update stats with crypto data
        this.stats.revenue = Math.round(data.bitcoin.usd * 10)
        this.stats.users = Math.round(data.ethereum.usd * 5)
        this.stats.orders = Math.round(data.binancecoin.usd * 2)
        this.stats.conversionRate = parseFloat(
          (data.bitcoin.usd_24h_change || 2.5).toFixed(2)
        )

        this.cryptoPrices = [
          {
            name: 'Bitcoin',
            price: data.bitcoin.usd,
            change: data.bitcoin.usd_24h_change,
          },
          {
            name: 'Ethereum',
            price: data.ethereum.usd,
            change: data.ethereum.usd_24h_change,
          },
          {
            name: 'BNB',
            price: data.binancecoin.usd,
            change: data.binancecoin.usd_24h_change,
          },
        ]

        this.loading.stats = false
      } catch (error) {
        console.error('Error fetching crypto prices:', error)
        this.fallbackStats()
        this.loading.stats = false
      }
    },

    // Fetch real news data
    async fetchNews() {
      try {
        this.loading.news = true
        // Using NewsAPI alternative - JSONPlaceholder for demo
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/posts?_limit=5'
        )
        const posts = await response.json()

        this.recentActivity = posts.map((post, index) => ({
          id: post.id,
          title:
            post.title.charAt(0).toUpperCase() +
            post.title.slice(0, 40) +
            '...',
          time: `${(index + 1) * 5} minutes ago`,
          icon: ['newspaper', 'trending-up', 'users', 'activity', 'star'][
            index
          ],
        }))

        this.loading.news = false
      } catch (error) {
        console.error('Error fetching news:', error)
        this.fallbackActivity()
        this.loading.news = false
      }
    },

    // Fetch random user data
    async fetchRandomUserData() {
      try {
        const response = await fetch('https://randomuser.me/api/?results=3')
        const data = await response.json()

        // Add real user activities
        const userActivities = data.results.map((user, index) => ({
          id: `user_${index}`,
          title: `${user.name.first} ${user.name.last} ${
            ['registered', 'updated profile', 'made purchase'][index]
          }`,
          time: `${Math.floor(Math.random() * 60)} minutes ago`,
          icon: ['user-plus', 'user-check', 'shopping-bag'][index],
        }))

        // Mix with existing activities
        this.recentActivity = [
          ...this.recentActivity.slice(0, 2),
          ...userActivities,
        ]
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    },

    fallbackStats() {
      this.stats = {
        revenue: 42750 + Math.floor(Math.random() * 10000),
        users: 1234 + Math.floor(Math.random() * 100),
        orders: 567 + Math.floor(Math.random() * 50),
        conversionRate: (Math.random() * 2 + 2.5).toFixed(2),
      }
    },

    fallbackActivity() {
      this.recentActivity = [
        {
          id: 1,
          title: 'New order received from John Doe',
          time: '2 minutes ago',
          icon: 'shopping-bag',
        },
        {
          id: 2,
          title: 'User Sarah Smith registered',
          time: '15 minutes ago',
          icon: 'user-plus',
        },
        {
          id: 3,
          title: 'Payment processed successfully',
          time: '1 hour ago',
          icon: 'credit-card',
        },
        {
          id: 4,
          title: 'New product added to catalog',
          time: '2 hours ago',
          icon: 'package',
        },
        {
          id: 5,
          title: 'System backup completed',
          time: '4 hours ago',
          icon: 'hard-drive',
        },
      ]
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
    },

    addTask() {
      if (this.newTask.trim()) {
        const newTask = {
          id: Date.now(),
          title: this.newTask.trim(),
          completed: false,
        }
        this.tasks.unshift(newTask)
        this.newTask = ''
        this.showAddTask = false
        this.saveTasks()
      }
    },

    toggleTask(taskId) {
      const task = this.tasks.find((t) => t.id === taskId)
      if (task) {
        task.completed = !task.completed
        this.saveTasks()
      }
    },

    removeTask(taskId) {
      this.tasks = this.tasks.filter((t) => t.id !== taskId)
      this.saveTasks()
    },

    saveTasks() {
      localStorage.setItem('dashboardTasks', JSON.stringify(this.tasks))
    },

    loadTasks() {
      const saved = localStorage.getItem('dashboardTasks')
      if (saved) {
        this.tasks = JSON.parse(saved)
      }
    },

    initChart() {
      this.$nextTick(() => {
        const ctx = document.getElementById('salesChart')
        if (ctx) {
          this.createChart(ctx)
        }
      })
    },

    createChart(ctx) {
      const isDark = document.documentElement.classList.contains('dark')
      const textColor = isDark ? '#e5e7eb' : '#374151'
      const gridColor = isDark ? '#374151' : '#e5e7eb'

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.getChartLabels(),
          datasets: [
            {
              label: 'Sales',
              data: this.getChartData(),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#3b82f6',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              border: {
                display: false,
              },
              grid: {
                color: gridColor,
                drawBorder: false,
              },
              ticks: {
                color: textColor,
                font: {
                  size: 12,
                },
              },
            },
            y: {
              border: {
                display: false,
              },
              grid: {
                color: gridColor,
                drawBorder: false,
              },
              ticks: {
                color: textColor,
                font: {
                  size: 12,
                },
                callback: function (value) {
                  return '$' + value.toLocaleString()
                },
              },
            },
          },
          elements: {
            point: {
              hoverBackgroundColor: '#1d4ed8',
            },
          },
          interaction: {
            intersect: false,
            mode: 'index',
          },
        },
      })
    },

    getChartLabels() {
      const labels = []
      const days =
        this.chartPeriod === '7d' ? 7 : this.chartPeriod === '30d' ? 30 : 90

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        labels.push(
          date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        )
      }

      return labels
    },

    getChartData() {
      const days =
        this.chartPeriod === '7d' ? 7 : this.chartPeriod === '30d' ? 30 : 90
      const data = []

      for (let i = 0; i < days; i++) {
        // Generate realistic sales data with trends
        const baseValue = 1000
        const trend = i * 10 // Upward trend
        const randomVariation = Math.random() * 500 - 250
        data.push(Math.max(0, baseValue + trend + randomVariation))
      }

      return data
    },
  }
}

// Weather widget functionality
function weather() {
  return {
    loading: false,
    currentWeather: {
      temp: 0,
      description: 'Loading...',
      icon: '⏳',
      location: 'Istanbul, TR',
      humidity: 0,
      windSpeed: 0,
    },

    forecast: [],

    async init() {
      await this.loadRealWeatherData()
    },

    async loadRealWeatherData() {
      try {
        this.loading = true

        // OpenWeatherMap One Call API (free tier)
        // Coordinates for Istanbul
        const lat = 41.0082
        const lon = 28.9784

        // Using Open-Meteo API (free, no API key required)
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Europe/Istanbul&forecast_days=3`
        )

        if (!weatherResponse.ok) {
          throw new Error('Weather API failed')
        }

        const weatherData = await weatherResponse.json()

        // Map weather codes to icons and descriptions
        const weatherCodeMap = {
          0: { icon: '☀️', desc: 'Clear sky' },
          1: { icon: '🌤️', desc: 'Mainly clear' },
          2: { icon: '⛅', desc: 'Partly cloudy' },
          3: { icon: '☁️', desc: 'Overcast' },
          45: { icon: '🌫️', desc: 'Foggy' },
          48: { icon: '🌫️', desc: 'Depositing rime fog' },
          51: { icon: '🌦️', desc: 'Light drizzle' },
          53: { icon: '🌦️', desc: 'Moderate drizzle' },
          55: { icon: '🌧️', desc: 'Dense drizzle' },
          61: { icon: '🌧️', desc: 'Slight rain' },
          63: { icon: '🌧️', desc: 'Moderate rain' },
          65: { icon: '⛈️', desc: 'Heavy rain' },
          71: { icon: '🌨️', desc: 'Slight snow' },
          73: { icon: '🌨️', desc: 'Moderate snow' },
          75: { icon: '❄️', desc: 'Heavy snow' },
          77: { icon: '🌨️', desc: 'Snow grains' },
          80: { icon: '🌦️', desc: 'Slight rain showers' },
          81: { icon: '🌧️', desc: 'Moderate rain showers' },
          82: { icon: '⛈️', desc: 'Violent rain showers' },
          85: { icon: '�️', desc: 'Slight snow showers' },
          86: { icon: '❄️', desc: 'Heavy snow showers' },
          95: { icon: '⛈️', desc: 'Thunderstorm' },
          96: { icon: '⛈️', desc: 'Thunderstorm with hail' },
          99: { icon: '⛈️', desc: 'Thunderstorm with heavy hail' },
        }

        const currentCode = weatherData.current_weather.weathercode
        const currentWeatherInfo = weatherCodeMap[currentCode] || {
          icon: '❓',
          desc: 'Unknown',
        }

        // Update current weather
        this.currentWeather = {
          temp: Math.round(weatherData.current_weather.temperature),
          description: currentWeatherInfo.desc,
          icon: currentWeatherInfo.icon,
          location: 'Istanbul, TR',
          windSpeed: Math.round(weatherData.current_weather.windspeed),
          humidity: Math.floor(Math.random() * 30) + 50, // API doesn't provide humidity, using random
        }

        // Update forecast
        this.forecast = weatherData.daily.time
          .slice(0, 3)
          .map((date, index) => {
            const maxTemp = Math.round(
              weatherData.daily.temperature_2m_max[index]
            )
            const weatherCode = weatherData.daily.weathercode[index]
            const weatherInfo = weatherCodeMap[weatherCode] || {
              icon: '❓',
              desc: 'Unknown',
            }

            const dayNames = ['Today', 'Tomorrow', 'Day 3']

            return {
              day: dayNames[index],
              temp: maxTemp,
              icon: weatherInfo.icon,
              date: new Date(date).toLocaleDateString('en-US', {
                weekday: 'short',
              }),
            }
          })

        this.loading = false
      } catch (error) {
        console.error('Error fetching weather data:', error)
        this.fallbackWeatherData()
        this.loading = false
      }
    },

    fallbackWeatherData() {
      const weatherConditions = [
        { temp: 22, description: 'Partly Cloudy', icon: '⛅' },
        { temp: 25, description: 'Sunny', icon: '☀️' },
        { temp: 18, description: 'Rainy', icon: '🌧️' },
        { temp: 15, description: 'Cloudy', icon: '☁️' },
        { temp: 28, description: 'Hot', icon: '🌞' },
      ]

      const randomWeather =
        weatherConditions[Math.floor(Math.random() * weatherConditions.length)]

      this.currentWeather = {
        temp: randomWeather.temp,
        description: randomWeather.description,
        icon: randomWeather.icon,
        location: 'Istanbul, TR',
        windSpeed: Math.floor(Math.random() * 15) + 5,
        humidity: Math.floor(Math.random() * 30) + 50,
      }

      // Update forecast
      this.forecast = [
        {
          day: 'Today',
          temp: this.currentWeather.temp,
          icon: this.currentWeather.icon,
        },
        {
          day: 'Tomorrow',
          temp: this.currentWeather.temp + Math.floor(Math.random() * 6) - 3,
          icon: weatherConditions[
            Math.floor(Math.random() * weatherConditions.length)
          ].icon,
        },
        {
          day: 'Wed',
          temp: this.currentWeather.temp + Math.floor(Math.random() * 8) - 4,
          icon: weatherConditions[
            Math.floor(Math.random() * weatherConditions.length)
          ].icon,
        },
      ]
    },
  }
}

// Utility functions
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Theme toggle functionality
function toggleTheme() {
  const html = document.documentElement
  const isDark = html.classList.contains('dark')

  if (isDark) {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  } else {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }
}

// Initialize theme on page load
function initTheme() {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark')
  }
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div')
  notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`

  const bgColor =
    {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500',
    }[type] || 'bg-blue-500'

  notification.className += ` ${bgColor} text-white`
  notification.textContent = message

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full')
  }, 100)

  // Animate out and remove
  setTimeout(() => {
    notification.classList.add('translate-x-full')
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Real-time updates simulation
function startRealTimeUpdates() {
  setInterval(async () => {
    // Refresh crypto prices every 30 seconds
    const dashboardElement = document.querySelector('[x-data*="dashboard"]')
    if (dashboardElement && dashboardElement._x_dataStack) {
      const dashboard = dashboardElement._x_dataStack[0]
      if (dashboard.fetchCryptoPrices) {
        await dashboard.fetchCryptoPrices()
      }
    }
  }, 30000) // Every 30 seconds

  setInterval(() => {
    // Simulate new activity notifications
    const activities = [
      'New user registration',
      'Order completed',
      'Payment processed',
      'Product updated',
      'System maintenance',
      'API request received',
      'Data backup completed',
      'Security scan passed',
    ]

    const types = ['info', 'success', 'warning']

    if (Math.random() > 0.8) {
      // 20% chance every interval
      const randomActivity =
        activities[Math.floor(Math.random() * activities.length)]
      const randomType = types[Math.floor(Math.random() * types.length)]

      showNotification(randomActivity, randomType)
    }
  }, 15000) // Every 15 seconds

  // Update weather every 10 minutes
  setInterval(async () => {
    const weatherElement = document.querySelector('[x-data*="weather"]')
    if (weatherElement && weatherElement._x_dataStack) {
      const weather = weatherElement._x_dataStack[0]
      if (weather.loadRealWeatherData) {
        await weather.loadRealWeatherData()
      }
    }
  }, 600000) // Every 10 minutes
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  initTheme()
  startRealTimeUpdates()

  // Add some interactive enhancements
  const cards = document.querySelectorAll('.bg-white, .dark\\:bg-gray-800')
  cards.forEach((card) => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-2px)'
    })

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)'
    })
  })
})
