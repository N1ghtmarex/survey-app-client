<script setup>
import axios from 'axios'

try {
  axios
    .post('https://localhost:7156/api/users/logout', null, {
      withCredentials: true,
    })
    .finally(() => {
      window.location.href = '/'
    })
} catch (error) {
  console.log(error)
}
</script>
