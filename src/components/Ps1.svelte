<script>
  import { theme } from '../stores/theme';
  import { username } from '../stores/username';
</script>

<h1 class="font-bold flex">
  <span style={`color: ${$theme.yellow};`}>{$username}</span>
  <span style={`color: ${$theme.white}`}>@</span>
  <span style={`color: ${$theme.green}`}>zedpholio</span>
  <span style={`color: ${$theme.white}`}>:~$</span>
</h1>
