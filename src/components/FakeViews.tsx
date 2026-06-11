import { Terminal as TerminalIcon, FileCode, FolderOpen, AlertCircle } from 'lucide-react';

export function FakeSidebar() {
  return (
    <div className="h-full flex flex-col bg-ide-sidebar border-r border-ide-border">
      <div className="flex items-center px-4 h-8 text-[#e7e7e7] uppercase tracking-wider text-xs font-semibold select-none">
        EXPLORER
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2 select-none text-[#cccccc] text-[13px]">
        <div className="flex items-center mb-1 cursor-pointer">
          <FolderOpen size={14} className="mr-2 text-ide-text-muted" />
          <span className="font-semibold text-ide-text">IDE-KOSPI-CORE</span>
        </div>
        <div className="pl-4">
          <div className="flex items-center mb-1 text-ide-text-muted hover:text-ide-text cursor-pointer">
            <FolderOpen size={14} className="mr-2" />
            <span>.github</span>
          </div>
          <div className="flex items-center mb-1 text-ide-text-muted hover:text-ide-text cursor-pointer">
            <FolderOpen size={14} className="mr-2" />
            <span>node_modules</span>
          </div>
          <div className="flex items-center mb-1 cursor-pointer">
            <FolderOpen size={14} className="mr-2 text-[#4fc1ff]" />
            <span className="text-[#e7e7e7]">src</span>
          </div>
          <div className="pl-4">
            <div className="flex items-center mb-1 cursor-pointer hover:bg-ide-bg rounded px-1">
              <FileCode size={14} className="mr-2 text-[#ffca28]" />
              <span className="text-ide-text">App.tsx</span>
            </div>
            <div className="flex items-center mb-1 cursor-pointer hover:bg-ide-bg rounded px-1">
              <FileCode size={14} className="mr-2 text-[#4fc1ff]" />
              <span className="text-ide-text">SecurityConfig.java</span>
            </div>
            <div className="flex items-center mb-1 cursor-pointer hover:bg-ide-bg rounded px-1">
              <FileCode size={14} className="mr-2 text-[#4fc1ff]" />
              <span className="text-ide-text">UserService.java</span>
            </div>
          </div>
          <div className="flex items-center mb-1 text-ide-text-muted hover:text-ide-text cursor-pointer">
            <FileCode size={14} className="mr-2 text-[#cc3e44]" />
            <span>package.json</span>
          </div>
          <div className="flex items-center mb-1 text-ide-text-muted hover:text-ide-text cursor-pointer">
            <FileCode size={14} className="mr-2 text-[#cc3e44]" />
            <span>build.gradle</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FakeEditor() {
  const renderLines = () => {
    return Array.from({ length: 150 }).map((_, i) => <div key={i}>{i + 1}</div>);
  };

  return (
    <div className="h-full flex flex-col bg-ide-bg">
      <div className="flex items-center h-9 bg-ide-bg border-b border-ide-border">
        <div className="flex items-center px-4 h-full bg-ide-bg border-r border-ide-border border-t-2 border-t-[#007acc] cursor-pointer">
          <FileCode size={14} className="mr-2 text-[#4fc1ff]" />
          <span className="text-ide-text text-[13px]">SecurityConfig.java</span>
        </div>
      </div>
      <div className="p-4 flex text-[14px] flex-1 overflow-auto custom-scrollbar">
        <div className="text-ide-text-muted text-right pr-4 select-none w-12 shrink-0 border-r border-ide-border mr-4 pb-20">
          {renderLines()}
        </div>
        <div className="text-ide-text whitespace-pre font-mono pb-20">
          <span className="text-code-keyword">package</span> <span className="text-ide-text">com.idekospi.security;</span><br/><br/>
          <span className="text-code-keyword">import</span> <span className="text-ide-text">org.springframework.context.annotation.Bean;</span><br/>
          <span className="text-code-keyword">import</span> <span className="text-ide-text">org.springframework.context.annotation.Configuration;</span><br/>
          <span className="text-code-keyword">import</span> <span className="text-ide-text">org.springframework.security.config.annotation.web.builders.HttpSecurity;</span><br/>
          <span className="text-code-keyword">import</span> <span className="text-ide-text">org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;</span><br/>
          <span className="text-code-keyword">import</span> <span className="text-ide-text">org.springframework.security.web.SecurityFilterChain;</span><br/>
          <span className="text-code-keyword">import</span> <span className="text-ide-text">org.springframework.security.config.http.SessionCreationPolicy;</span><br/>
          <span className="text-code-keyword">import</span> <span className="text-ide-text">org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;</span><br/>
          <span className="text-code-keyword">import</span> <span className="text-ide-text">org.springframework.security.crypto.password.PasswordEncoder;</span><br/>
          <span className="text-code-keyword">import</span> <span className="text-ide-text">org.springframework.web.cors.CorsConfiguration;</span><br/>
          <span className="text-code-keyword">import</span> <span className="text-ide-text">org.springframework.web.cors.CorsConfigurationSource;</span><br/>
          <span className="text-code-keyword">import</span> <span className="text-ide-text">org.springframework.web.cors.UrlBasedCorsConfigurationSource;</span><br/>
          <span className="text-code-keyword">import</span> <span className="text-ide-text">java.util.Arrays;</span><br/>
          <span className="text-code-keyword">import</span> <span className="text-ide-text">java.util.List;</span><br/><br/>
          
          <span className="text-code-comment pl-0">/**</span><br/>
          <span className="text-code-comment pl-0"> * Core Security Configuration for the application.</span><br/>
          <span className="text-code-comment pl-0"> * Handles CORS, CSRF, Session Management, and Role-based Access Control.</span><br/>
          <span className="text-code-comment pl-0"> */</span><br/>
          <span className="text-code-function pl-0">@Configuration</span><br/>
          <span className="text-code-function pl-0">@EnableWebSecurity</span><br/>
          <span className="text-code-keyword2">public class</span> <span className="text-code-class">SecurityConfig</span> <span className="text-ide-text"> {'{'}</span><br/><br/>
          
          <span className="text-code-function pl-8">@Bean</span><br/>
          <span className="text-code-keyword pl-8">public</span> <span className="text-code-class">SecurityFilterChain</span> <span className="text-code-function">filterChain</span><span className="text-ide-text">(</span><span className="text-code-class">HttpSecurity</span> <span className="text-code-variable">http</span><span className="text-ide-text">)</span> <span className="text-code-keyword">throws</span> <span className="text-code-class">Exception</span> <span className="text-ide-text">{'{'}</span><br/>
          <span className="text-ide-text pl-12">http</span><br/>
          <span className="text-ide-text pl-16">.cors(cors -&gt; cors.configurationSource(corsConfigurationSource()))</span><br/>
          <span className="text-ide-text pl-16">.csrf(csrf -&gt; csrf.disable())</span><br/>
          <span className="text-ide-text pl-16">.authorizeHttpRequests(auth -&gt; auth</span><br/>
          <span className="text-ide-text pl-20">.requestMatchers(</span><span className="text-code-string">"/api/public/**"</span><span className="text-ide-text">, </span><span className="text-code-string">"/api/auth/login"</span><span className="text-ide-text">, </span><span className="text-code-string">"/api/health"</span><span className="text-ide-text">).permitAll()</span><br/>
          <span className="text-ide-text pl-20">.requestMatchers(</span><span className="text-code-string">"/api/admin/**"</span><span className="text-ide-text">).hasRole(</span><span className="text-code-string">"ADMIN"</span><span className="text-ide-text">)</span><br/>
          <span className="text-ide-text pl-20">.requestMatchers(</span><span className="text-code-string">"/api/manager/**"</span><span className="text-ide-text">).hasAnyRole(</span><span className="text-code-string">"ADMIN"</span><span className="text-ide-text">, </span><span className="text-code-string">"MANAGER"</span><span className="text-ide-text">)</span><br/>
          <span className="text-ide-text pl-20">.requestMatchers(</span><span className="text-code-string">"/api/user/**"</span><span className="text-ide-text">).authenticated()</span><br/>
          <span className="text-ide-text pl-20">.anyRequest().authenticated()</span><br/>
          <span className="text-ide-text pl-16">)</span><br/>
          <span className="text-ide-text pl-16">.sessionManagement(session -&gt; session</span><br/>
          <span className="text-ide-text pl-20">.sessionCreationPolicy(SessionCreationPolicy.STATELESS)</span><br/>
          <span className="text-ide-text pl-16">)</span><br/>
          <span className="text-ide-text pl-16">.exceptionHandling(ex -&gt; ex</span><br/>
          <span className="text-ide-text pl-20">.authenticationEntryPoint(new CustomAuthenticationEntryPoint())</span><br/>
          <span className="text-ide-text pl-20">.accessDeniedHandler(new CustomAccessDeniedHandler())</span><br/>
          <span className="text-ide-text pl-16">)</span><br/>
          <span className="text-ide-text pl-16">.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);</span><br/><br/>
          
          <span className="text-code-keyword2 pl-12">return</span> <span className="text-ide-text">http.build();</span><br/>
          <span className="text-ide-text pl-8">{'}'}</span><br/><br/>

          <span className="text-code-function pl-8">@Bean</span><br/>
          <span className="text-code-keyword pl-8">public</span> <span className="text-code-class">CorsConfigurationSource</span> <span className="text-code-function">corsConfigurationSource</span><span className="text-ide-text">() {'{'}</span><br/>
          <span className="text-code-class pl-12">CorsConfiguration</span> <span className="text-code-variable">configuration</span> <span className="text-ide-text">= </span><span className="text-code-keyword2">new</span> <span className="text-code-class">CorsConfiguration</span><span className="text-ide-text">();</span><br/>
          <span className="text-ide-text pl-12">configuration.setAllowedOrigins(Arrays.asList(</span><span className="text-code-string">"https://localhost:3000"</span><span className="text-ide-text">, </span><span className="text-code-string">"https://production.example.com"</span><span className="text-ide-text">));</span><br/>
          <span className="text-ide-text pl-12">configuration.setAllowedMethods(Arrays.asList(</span><span className="text-code-string">"GET"</span><span className="text-ide-text">, </span><span className="text-code-string">"POST"</span><span className="text-ide-text">, </span><span className="text-code-string">"PUT"</span><span className="text-ide-text">, </span><span className="text-code-string">"PATCH"</span><span className="text-ide-text">, </span><span className="text-code-string">"DELETE"</span><span className="text-ide-text">, </span><span className="text-code-string">"OPTIONS"</span><span className="text-ide-text">));</span><br/>
          <span className="text-ide-text pl-12">configuration.setAllowedHeaders(Arrays.asList(</span><span className="text-code-string">"Authorization"</span><span className="text-ide-text">, </span><span className="text-code-string">"Content-Type"</span><span className="text-ide-text">, </span><span className="text-code-string">"X-Requested-With"</span><span className="text-ide-text">));</span><br/>
          <span className="text-ide-text pl-12">configuration.setExposedHeaders(Arrays.asList(</span><span className="text-code-string">"Authorization"</span><span className="text-ide-text">));</span><br/>
          <span className="text-ide-text pl-12">configuration.setAllowCredentials(</span><span className="text-code-keyword">true</span><span className="text-ide-text">);</span><br/>
          <span className="text-ide-text pl-12">configuration.setMaxAge(</span><span className="text-code-number">3600L</span><span className="text-ide-text">);</span><br/><br/>

          <span className="text-code-class pl-12">UrlBasedCorsConfigurationSource</span> <span className="text-code-variable">source</span> <span className="text-ide-text">= </span><span className="text-code-keyword2">new</span> <span className="text-code-class">UrlBasedCorsConfigurationSource</span><span className="text-ide-text">();</span><br/>
          <span className="text-ide-text pl-12">source.registerCorsConfiguration(</span><span className="text-code-string">"/**"</span><span className="text-ide-text">, configuration);</span><br/>
          <span className="text-code-keyword2 pl-12">return</span> <span className="text-ide-text">source;</span><br/>
          <span className="text-ide-text pl-8">{'}'}</span><br/><br/>

          <span className="text-code-function pl-8">@Bean</span><br/>
          <span className="text-code-keyword pl-8">public</span> <span className="text-code-class">PasswordEncoder</span> <span className="text-code-function">passwordEncoder</span><span className="text-ide-text">() {'{'}</span><br/>
          <span className="text-code-keyword2 pl-12">return new</span> <span className="text-code-class">BCryptPasswordEncoder</span><span className="text-ide-text">(</span><span className="text-code-number">12</span><span className="text-ide-text">);</span><br/>
          <span className="text-ide-text pl-8">{'}'}</span><br/><br/>
          
          <span className="text-code-comment pl-8">/** </span><br/>
          <span className="text-code-comment pl-8"> * Custom JWT Filter for extracting and validating tokens </span><br/>
          <span className="text-code-comment pl-8"> */</span><br/>
          <span className="text-code-function pl-8">@Bean</span><br/>
          <span className="text-code-keyword pl-8">public</span> <span className="text-code-class">JwtAuthenticationFilter</span> <span className="text-code-function">jwtAuthenticationFilter</span><span className="text-ide-text">() {'{'}</span><br/>
          <span className="text-code-keyword2 pl-12">return new</span> <span className="text-code-class">JwtAuthenticationFilter</span><span className="text-ide-text">();</span><br/>
          <span className="text-ide-text pl-8">{'}'}</span><br/><br/>

          <span className="text-code-function pl-8">@Bean</span><br/>
          <span className="text-code-keyword pl-8">public</span> <span className="text-code-class">AuthenticationManager</span> <span className="text-code-function">authenticationManager</span><span className="text-ide-text">(</span><span className="text-code-class">AuthenticationConfiguration</span> <span className="text-code-variable">authConfig</span><span className="text-ide-text">) </span><span className="text-code-keyword">throws</span> <span className="text-code-class">Exception</span> <span className="text-ide-text">{'{'}</span><br/>
          <span className="text-code-keyword2 pl-12">return</span> <span className="text-ide-text">authConfig.getAuthenticationManager();</span><br/>
          <span className="text-ide-text pl-8">{'}'}</span><br/><br/>

          <span className="text-code-function pl-8">@Bean</span><br/>
          <span className="text-code-keyword pl-8">public</span> <span className="text-code-class">RoleHierarchy</span> <span className="text-code-function">roleHierarchy</span><span className="text-ide-text">() {'{'}</span><br/>
          <span className="text-code-class pl-12">RoleHierarchyImpl</span> <span className="text-code-variable">roleHierarchy</span> <span className="text-ide-text">= </span><span className="text-code-keyword2">new</span> <span className="text-code-class">RoleHierarchyImpl</span><span className="text-ide-text">();</span><br/>
          <span className="text-code-class pl-12">String</span> <span className="text-code-variable">hierarchy</span> <span className="text-ide-text">= </span><span className="text-code-string">"ROLE_ADMIN &gt; ROLE_MANAGER \n ROLE_MANAGER &gt; ROLE_USER"</span><span className="text-ide-text">;</span><br/>
          <span className="text-ide-text pl-12">roleHierarchy.setHierarchy(hierarchy);</span><br/>
          <span className="text-code-keyword2 pl-12">return</span> <span className="text-ide-text">roleHierarchy;</span><br/>
          <span className="text-ide-text pl-8">{'}'}</span><br/><br/>
          
          <span className="text-ide-text">{'}'}</span>
        </div>
      </div>
    </div>
  );
}

export function FakeTerminal() {
  return (
    <div className="h-full flex flex-col bg-ide-bg font-mono text-[13px] border-t border-ide-border">
      <div className="flex items-center px-4 h-8 text-[#e7e7e7] uppercase tracking-wider text-xs font-semibold select-none bg-ide-sidebar">
        <TerminalIcon size={14} className="mr-2" />
        Terminal
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="text-ide-text-muted mb-2">➜  IDE-KOSPI-CORE git:(main) ✗ ./gradlew build</div>
        <div className="text-ide-text mb-1">Starting a Gradle Daemon (subsequent builds will be faster)</div>
        <div className="text-ide-text mb-1">&gt; Task :compileJava</div>
        <div className="text-ide-text mb-1">&gt; Task :processResources</div>
        <div className="text-ide-text mb-1">&gt; Task :classes</div>
        <div className="text-ide-text mb-1">&gt; Task :bootJar</div>
        <div className="text-ide-text mb-1">&gt; Task :jar</div>
        <div className="text-ide-text mb-1">&gt; Task :assemble</div>
        <div className="text-ide-text mb-1">&gt; Task :compileTestJava</div>
        <div className="text-ide-text mb-1">&gt; Task :processTestResources</div>
        <div className="text-ide-text mb-1">&gt; Task :testClasses</div>
        <div className="text-[#ff9d9d] mb-1">
          <AlertCircle size={12} className="inline mr-1" />
          Note: Some input files use or override a deprecated API.
        </div>
        <div className="text-[#ff9d9d] mb-2">
          <AlertCircle size={12} className="inline mr-1" />
          Note: Recompile with -Xlint:deprecation for details.
        </div>
        <div className="text-[#519657] mb-2 font-bold">BUILD SUCCESSFUL in 14s</div>
        <div className="text-ide-text-muted mb-1">8 actionable tasks: 8 executed</div>
        <div className="flex items-center mt-2">
          <span className="text-[#519657] mr-2">➜</span>
          <span className="text-[#4fc1ff] mr-2">IDE-KOSPI-CORE</span>
          <span className="text-ide-text-muted animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
}

export function FakeStatusBar() {
  return (
    <div className="h-6 flex items-center px-3 bg-[#007acc] text-white text-[12px] justify-between select-none shrink-0">
      <div className="flex items-center space-x-4">
        <span className="flex items-center hover:bg-white/20 px-2 cursor-pointer h-full">
          main*
        </span>
        <span className="flex items-center hover:bg-white/20 px-2 cursor-pointer h-full">
          <AlertCircle size={13} className="mr-1" />
          0, 0
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="hover:bg-white/20 px-2 cursor-pointer h-full flex items-center">UTF-8</span>
        <span className="hover:bg-white/20 px-2 cursor-pointer h-full flex items-center">Java</span>
        <span className="hover:bg-white/20 px-2 cursor-pointer h-full flex items-center">Spring Boot</span>
      </div>
    </div>
  );
}
