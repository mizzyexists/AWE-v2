<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit7ce862deafe8948456fc48552670350a
{
    public static $prefixLengthsPsr4 = array (
        'R' => 
        array (
            'ReallySimpleJWT\\' => 16,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'ReallySimpleJWT\\' => 
        array (
            0 => __DIR__ . '/..' . '/rbdwllr/reallysimplejwt/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit7ce862deafe8948456fc48552670350a::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit7ce862deafe8948456fc48552670350a::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit7ce862deafe8948456fc48552670350a::$classMap;

        }, null, ClassLoader::class);
    }
}
