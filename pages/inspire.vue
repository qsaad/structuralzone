<template>
  <v-layout>
    <v-flex text-xs-center>
      <img src="/v.png" alt="Vuetify.js" class="mb-5">
      <img usemap="#retaining-wall" src="/retaining-wall.jpg" alt="Vuetify.js" class="mb-5 " id="content" width=450>
      <map name="retaining-wall">
        <area alt="SBC" title="SBC" href="" coords="5,5,10,10" shape="rect">
        <area alt="Soil density" title="soil" href="" coords="37,102,482,223" shape="rect">
        <area alt="Concrete Strength" title="fc" href="" coords="47,258,487,381" shape="rect">
        <area alt="Toe Soil" title="hs" href="" coords="189,679,310,977" shape="rect">
      </map>
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
    </v-flex>
  </v-layout>
</template>

<style scoped>
body {
  margin: 0;
  padding: 0;
  height: 100%;
    background-color: #434343;
    background-image:linear-gradient(#434343, #282828);
}
#content{
    background-color: transparent;
    background-image: linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .7) 25%, rgba(255, 255, 255, .7) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent);
  height:100%;
  background-size:50px 50px;
}


</style>
